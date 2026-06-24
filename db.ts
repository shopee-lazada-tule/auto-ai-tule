import type { Marketplace } from './constants';
import { activeListings, soldItems } from './mockData';
import { selectedListingCsvRows } from './store';

const listingHeaders = ['Marketplace', 'Country', 'ASIN', 'SKU', 'ProductName', 'Description', 'Currency', 'Price', 'Stock', 'CategoryId', 'WeightKg', 'LengthCm', 'WidthCm', 'HeightCm'];
export type ListingCsvType = 'NEW_LISTING' | 'NEED_CHECK_ONLY' | 'ERROR_ONLY';

export function toCsv(rows: Record<string, unknown>[], forcedHeaders?: string[]) {
  const headers = forcedHeaders ?? Object.keys(rows[0] ?? {});
  if (!headers.length) return '';
  const escape = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;
  return [headers.join(','), ...rows.map(row => headers.map(h => escape(row[h])).join(','))].join('\n');
}

export async function buildListingCsvRows(marketplace: Marketplace, type: ListingCsvType = 'NEW_LISTING') {
  return selectedListingCsvRows(marketplace, type);
}

export function listingCsvHeaders() {
  return listingHeaders;
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
