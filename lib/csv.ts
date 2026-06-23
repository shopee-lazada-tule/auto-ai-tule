import type { Marketplace } from './constants';
import { activeListings, listingRows, products, soldItems } from './mockData';

export function toCsv(rows: Record<string, unknown>[]) {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const escape = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;
  return [headers.join(','), ...rows.map(row => headers.map(h => escape(row[h])).join(','))].join('\n');
}

export function buildListingCsvRows(marketplace: Marketplace) {
  const product = products[0];
  return listingRows(marketplace, product).filter(row => row.selected).map(row => ({
    Category: '',
    'Product Name': `${product.title} 【Direct from Japan】`,
    'Product Description': 'Direct from Japan. Please check product details before purchase.',
    Price: row.recommendedPrice,
    Stock: 1,
    SKU: `${product.asin}-${row.country}`,
    'Cover image': '',
    'Item Image 1': '',
    Weight: product.weight,
    Length: '',
    Width: '',
    Height: '',
    Marketplace: marketplace,
    Country: row.country,
  }));
}

export function buildActiveListingCsvRows() {
  return activeListings.map(item => ({
    Marketplace: item.marketplace,
    Country: item.country,
    ASIN: item.asin,
    SKU: item.sku,
    Name: item.name,
    Price: item.price,
    Currency: item.currency,
    Stock: item.stock,
    Status: item.status,
  }));
}

export function buildSoldCsvRows() {
  return soldItems.map(item => ({
    OrderId: item.orderId,
    Marketplace: item.marketplace,
    Country: item.country,
    ASIN: item.asin,
    SKU: item.sku,
    Name: item.name,
    Sales: item.sales,
    Currency: item.currency,
    EstimatedProfitJpy: item.estimatedProfit,
    ActualProfitJpy: item.actualProfit ?? '',
    Status: item.status,
  }));
}
