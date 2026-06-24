import { PrismaClient } from '@prisma/client';
import { countriesByMarketplace, currencyByCountry, type Country, type Marketplace } from '../lib/constants';
import { loadEnvLocal } from '../lib/server-env';

loadEnvLocal();

if (!process.env.DATABASE_URL) {
  console.log('DATABASE_URL is empty. Seed skipped; MEMORY fallback remains available.');
  process.exit(0);
}

const prisma = new PrismaClient();
const userId = 'demo-user';

const sampleProducts = [
  {
    asin: 'B00MG84XN4',
    amazonUrl: 'https://www.amazon.co.jp/dp/B00MG84XN4',
    title: 'Ozio Royal Jelly Moisturizing Gel 75g',
    amazonPriceJpy: 4180,
    weightKg: 0.3,
    stockAvailable: true,
    primeAvailable: true,
    dataSource: 'MANUAL' as const,
    imageUrls: ['https://example.invalid/B00MG84XN4/1.jpg'],
  },
  {
    asin: 'B09S3N7WCJ',
    amazonUrl: 'https://www.amazon.co.jp/dp/B09S3N7WCJ',
    title: 'AGF Premium Drip Coffee 14 bags x 3',
    amazonPriceJpy: 1760,
    weightKg: 0.56,
    stockAvailable: true,
    primeAvailable: true,
    dataSource: 'MANUAL' as const,
    imageUrls: ['https://example.invalid/B09S3N7WCJ/1.jpg'],
  },
  {
    asin: 'B074MX813G',
    amazonUrl: 'https://www.amazon.co.jp/dp/B074MX813G',
    title: 'Nescafe Gold Blend 120g',
    amazonPriceJpy: 1027,
    weightKg: 0.42,
    stockAvailable: true,
    primeAvailable: true,
    dataSource: 'MANUAL' as const,
    imageUrls: ['https://example.invalid/B074MX813G/1.jpg'],
  },
];

const samplePrices: Record<Marketplace, Record<Country, number>> = {
  SHOPEE: { SG: 32.9, MY: 99, PH: 1299, TH: 899, TW: 980, VN: 499000, ID: 0 },
  LAZADA: { SG: 31.5, MY: 96, PH: 1240, TH: 870, TW: 0, VN: 489000, ID: 159000 },
};

async function main() {
  await prisma.user.upsert({
    where: { email: 'demo@auto-ai-tule.local' },
    update: {},
    create: { id: userId, email: 'demo@auto-ai-tule.local', name: 'Demo User' },
  });

  for (const [marketplace, countries] of Object.entries(countriesByMarketplace) as [Marketplace, Country[]][]) {
    for (const country of countries) {
      await prisma.countrySetting.upsert({
        where: { userId_marketplace_country: { userId, marketplace, country } },
        update: { enabled: true },
        create: {
          userId,
          marketplace,
          country,
          enabled: true,
          defaultTitleLanguage: country === 'TH' ? 'th' : country === 'TW' ? 'zh-TW' : country === 'VN' ? 'vi' : country === 'ID' ? 'id' : 'en',
          defaultDescriptionLanguage: country === 'TH' ? 'th' : country === 'TW' ? 'zh-TW' : country === 'VN' ? 'vi' : country === 'ID' ? 'id' : 'en',
        },
      });

      await prisma.feeSetting.upsert({
        where: { userId_marketplace_country: { userId, marketplace, country } },
        update: {
          marketplaceFeeRate: marketplace === 'SHOPEE' ? 10 : 8,
          paymentFeeRate: 2,
          payoutProvider: marketplace === 'SHOPEE' ? 'PAYONEER' : 'WORLD_FIRST',
          payoutFeeRate: marketplace === 'SHOPEE' ? 2 : 1.5,
          payoutFixedFeeJpy: 0,
          otherCostJpy: 100,
        },
        create: {
          userId,
          marketplace,
          country,
          marketplaceFeeRate: marketplace === 'SHOPEE' ? 10 : 8,
          paymentFeeRate: 2,
          payoutProvider: marketplace === 'SHOPEE' ? 'PAYONEER' : 'WORLD_FIRST',
          payoutFeeRate: marketplace === 'SHOPEE' ? 2 : 1.5,
          payoutFixedFeeJpy: 0,
          otherCostJpy: 100,
        },
      });

      await prisma.fxLockSetting.upsert({
        where: { userId_marketplace_country: { userId, marketplace, country } },
        update: { lockTiming: country === 'SG' || country === 'MY' ? 'ORDER_CREATED' : 'SHIPPED' },
        create: {
          userId,
          marketplace,
          country,
          lockTiming: country === 'SG' || country === 'MY' ? 'ORDER_CREATED' : 'SHIPPED',
        },
      });
    }
  }

  const products = [];
  for (const product of sampleProducts) {
    const saved = await prisma.amazonProduct.upsert({
      where: { userId_asin: { userId, asin: product.asin } },
      update: product,
      create: { userId, ...product },
    });
    products.push(saved);
  }

  for (const product of products.slice(0, 2)) {
    for (const marketplace of ['SHOPEE', 'LAZADA'] as Marketplace[]) {
      for (const country of countriesByMarketplace[marketplace]) {
        await prisma.listingDraft.upsert({
          where: {
            userId_amazonProductId_marketplace_country: {
              userId,
              amazonProductId: product.id,
              marketplace,
              country,
            },
          },
          update: {
            title: `${product.title} Direct from Japan`,
            priceLocal: samplePrices[marketplace][country],
            currency: currencyByCountry[country],
            stock: product.stockAvailable ? 1 : 0,
            sku: `${product.asin}-${marketplace}-${country}`,
            judgement: product.stockAvailable ? 'C' : 'NEED_CHECK',
            status: product.stockAvailable ? 'CANDIDATE' : 'NEED_CHECK',
          },
          create: {
            userId,
            amazonProductId: product.id,
            marketplace,
            country,
            selectedForListing: false,
            title: `${product.title} Direct from Japan`,
            titleLanguage: 'en',
            description: 'Direct from Japan. Please check product details before purchase.',
            descriptionLanguage: 'en',
            priceLocal: samplePrices[marketplace][country],
            currency: currencyByCountry[country],
            stock: product.stockAvailable ? 1 : 0,
            sku: `${product.asin}-${marketplace}-${country}`,
            weightKg: product.weightKg,
            imageUrls: product.imageUrls as string[],
            judgement: product.stockAvailable ? 'C' : 'NEED_CHECK',
            status: product.stockAvailable ? 'CANDIDATE' : 'NEED_CHECK',
          },
        });
      }
    }
  }

  console.log('Seed completed: countries, payout settings, fx lock settings, sample products, and listing drafts.');
}

main()
  .catch(error => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
