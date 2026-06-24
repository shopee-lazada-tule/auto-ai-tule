import { buildListingCsvRows } from '../lib/csv';
import { getPrisma, sanitizeDatabaseMessage } from '../lib/db';
import { generateListingDrafts, listListingDrafts, listProducts, saveProduct, updateListingDraftSelection } from '../lib/store';

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set. Configure .env.local before DB save check.');

  const asin = 'B0NEON0001';
  const saved = await saveProduct({
    asin,
    amazonUrl: `https://www.amazon.co.jp/dp/${asin}`,
    title: 'Neon DB Save Check Product',
    amazonPriceJpy: 1980,
    weightKg: 0.25,
    imageUrls: 'https://example.invalid/neon-check.jpg',
    dataSource: 'MANUAL',
  });
  if (saved.storage !== 'prisma') throw new Error(`Product save did not use Prisma storage: ${saved.storage}`);

  const products = await listProducts(new URLSearchParams({ q: asin, page: '1', pageSize: '10' }));
  if (products.storage !== 'prisma' || !products.items.some(item => item.asin === asin)) throw new Error('Product list did not return the saved DB product.');

  const generated = await generateListingDrafts({ marketplace: 'SHOPEE', asin });
  if (generated.storage !== 'prisma' || generated.generatedCount < 6) throw new Error('Listing drafts were not generated in DB.');

  const drafts = await listListingDrafts(new URLSearchParams({ marketplace: 'SHOPEE', q: asin, pageSize: '50' }));
  const target = drafts.items.find(item => item.country === 'SG');
  if (!target) throw new Error('Generated SG listing draft was not found.');

  const selection = await updateListingDraftSelection({ ids: [target.id], selectedForListing: true });
  if (selection.storage !== 'prisma' || selection.updatedCount < 1) throw new Error('Listing draft selection was not saved in DB.');

  const selected = await listListingDrafts(new URLSearchParams({ marketplace: 'SHOPEE', q: asin, selectedForListing: 'true', pageSize: '50' }));
  if (!selected.items.some(item => item.id === target.id && item.selectedForListing)) throw new Error('Selected listing draft was not returned from DB.');

  const csvRows = await buildListingCsvRows('SHOPEE', 'NEW_LISTING');
  if (!csvRows.some(row => row.ASIN === asin && row.Country === 'SG')) throw new Error('CSV rows did not include the selected DB listing draft.');

  console.log(`db-save-check ok product=${asin} generated=${generated.generatedCount} selected=${selected.total} csvRows=${csvRows.length}`);

  await getPrisma()?.$disconnect();
}

main().catch(async error => {
  console.error(sanitizeDatabaseMessage(error));
  await getPrisma()?.$disconnect();
  process.exit(1);
});
