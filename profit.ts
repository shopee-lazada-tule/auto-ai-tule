import { Country, Marketplace, countriesByMarketplace, currencyByCountry, payoutDefaults, type FxLockTiming } from './constants';
import { calculateProfit } from './profit';

export const dashboardStats = [
  { label: '登録ASIN', value: '12,480', note: '商品登録ページで検索・処理' },
  { label: '出品候補', value: '3,240', note: '出品候補ページで国別選択' },
  { label: '出品中', value: '1,852', note: '出品中商品ページで管理' },
  { label: '要確認', value: '187', note: '自動アップロード停止中' },
  { label: '未返信', value: '9', note: 'メッセージページで対応' },
  { label: '今月売上', value: '¥1,284,600', note: '売上管理ページで確認' },
];

export const products = [
  { asin: 'B00MG84XN4', title: 'Ozio Royal Jelly Moisturizing Gel 75g', price: 4180, source: 'SP_API', stock: true, prime: true, weight: 0.3, size: '6.4 x 6.2 x 4.8cm', imageCount: 5 },
  { asin: 'B09S3N7WCJ', title: 'AGF Premium Drip Coffee 14 bags x 3', price: 1760, source: 'SP_API', stock: true, prime: true, weight: 0.56, size: '38.1 x 20.2 x 12cm', imageCount: 7 },
  { asin: 'B074MX813G', title: 'Nescafe Gold Blend 120g', price: 1027, source: 'KEEPA', stock: true, prime: true, weight: 0.42, size: '14.7 x 7.5 x 7.4cm', imageCount: 7 },
  { asin: 'B09G1M4S5V', title: 'PERFECT ONE Whitening Gel 75g', price: 4950, source: 'MANUAL', stock: false, prime: false, weight: 0.16, size: '7.2 x 7.1 x 6cm', imageCount: 7 },
  { asin: 'B07NFCVCPQ', title: 'AGF Blendy Stick Cafe au Lait 100 sticks', price: 2045, source: 'SP_API', stock: true, prime: true, weight: 0.82, size: '18 x 16.2 x 13.8cm', imageCount: 6 },
  { asin: 'B001PM4JBS', title: 'Shiseido Urea 10% Cream 100g', price: 1250, source: 'KEEPA', stock: true, prime: false, weight: 0.16, size: '7.9 x 6.9 x 6.3cm', imageCount: 2 },
];

const priceSets: Record<Marketplace, Record<Country, number>> = {
  SHOPEE: { SG: 32.9, MY: 99, PH: 1299, TH: 899, TW: 980, VN: 499000, ID: 0 },
  LAZADA: { SG: 31.5, MY: 96, PH: 1240, TH: 870, TW: 0, VN: 489000, ID: 159000 },
};

const exchangeRates: Record<Country, number> = {
  SG: 122.1,
  MY: 38.0,
  PH: 2.6,
  TH: 4.76,
  TW: 5.0,
  VN: 0.006,
  ID: 0.0097,
};

export function listingRows(marketplace: Marketplace, product = products[0]) {
  return countriesByMarketplace[marketplace].map((country, index) => {
    const sellingPriceLocal = priceSets[marketplace][country];
    const rate = exchangeRates[country];
    const payoutFeeRate = marketplace === 'SHOPEE' ? 2 : 1.5;
    const result = calculateProfit({
      marketplace,
      country,
      sellingPriceLocal,
      exchangeRate: rate,
      amazonCostJpy: product.price,
      marketplaceFeeRate: marketplace === 'SHOPEE' ? 10 : 8,
      paymentFeeRate: 2,
      payoutFeeRate,
      otherCostJpy: 100,
      internationalShippingJpy: null,
      targetProfitJpy: 500,
    });
    const forced = ['A', 'B', 'C', 'NEED_CHECK', 'A', 'B'][index] as any;
    return {
      country,
      countryName: country,
      currency: currencyByCountry[country],
      judgement: index === 3 && product.source === 'MANUAL' ? 'NEED_CHECK' : forced,
      recommendedPrice: sellingPriceLocal,
      profitJpy: result.profitJpy,
      allowableShippingJpy: result.allowableShippingJpy,
      selected: index <= 1,
      status: index === 3 ? '要確認' : '候補',
    };
  });
}

export const activeListings = [
  { marketplace: 'SHOPEE', country: 'TW', asin: 'B00MG84XN4', sku: 'B00MG84XN4-TW', name: 'Royal Jelly Gel', price: 980, currency: 'TWD', stock: 3, sold: 18, lastSynced: '2026-06-23 10:20', status: 'ACTIVE' },
  { marketplace: 'SHOPEE', country: 'SG', asin: 'B09S3N7WCJ', sku: 'B09S3N7WCJ-SG', name: 'AGF Drip Coffee', price: 26.9, currency: 'SGD', stock: 8, sold: 31, lastSynced: '2026-06-23 10:15', status: 'ACTIVE' },
  { marketplace: 'LAZADA', country: 'MY', asin: 'B074MX813G', sku: 'B074MX813G-MY', name: 'Nescafe Gold Blend', price: 45.9, currency: 'MYR', stock: 5, sold: 11, lastSynced: '2026-06-23 09:50', status: 'ACTIVE' },
  { marketplace: 'LAZADA', country: 'VN', asin: 'B07NFCVCPQ', sku: 'B07NFCVCPQ-VN', name: 'AGF Blendy Stick', price: 255000, currency: 'VND', stock: 2, sold: 9, lastSynced: '2026-06-22 22:10', status: 'NEED_CHECK' },
];

export const soldItems = [
  { orderId: 'SP-TW-10021', marketplace: 'SHOPEE', country: 'TW', asin: 'B00MG84XN4', sku: 'B00MG84XN4-TW', name: 'Royal Jelly Gel', sales: 980, currency: 'TWD', lock: 'SHIPPED' as FxLockTiming, estimatedProfit: 590, actualProfit: 548, status: 'SHIPPED', orderedAt: '2026-06-22' },
  { orderId: 'LZ-MY-88211', marketplace: 'LAZADA', country: 'MY', asin: 'B074MX813G', sku: 'B074MX813G-MY', name: 'Nescafe Gold Blend', sales: 45.9, currency: 'MYR', lock: 'ORDER_CREATED' as FxLockTiming, estimatedProfit: 310, actualProfit: null, status: 'ORDERED', orderedAt: '2026-06-23' },
  { orderId: 'SP-SG-10033', marketplace: 'SHOPEE', country: 'SG', asin: 'B09S3N7WCJ', sku: 'B09S3N7WCJ-SG', name: 'AGF Drip Coffee', sales: 26.9, currency: 'SGD', lock: 'SHIPPED' as FxLockTiming, estimatedProfit: 430, actualProfit: 402, status: 'PAYOUT_CONFIRMED', orderedAt: '2026-06-18' },
];

export const salesSummary = {
  monthSalesJpy: 1284600,
  expectedPayoutJpy: 1139200,
  expectedProfitJpy: 246800,
  receivedPayoutJpy: 728400,
  profitDiffJpy: -12800,
  pendingPayoutCount: 18,
};

export const messageThreads = [
  { marketplace: 'SHOPEE', country: 'SG', buyer: 'buyer_1024', category: 'STOCK_CHECK', text: 'Is this item available?', deadline: '残り 4時間', status: 'UNREPLIED' },
  { marketplace: 'LAZADA', country: 'MY', buyer: 'buyer_2078', category: 'DISCOUNT', text: 'Can you give discount for 3 pcs?', deadline: '要確認', status: 'NEED_CHECK' },
  { marketplace: 'SHOPEE', country: 'TW', buyer: 'buyer_5510', category: 'SHIPPING', text: 'When can you ship?', deadline: '残り 8時間', status: 'UNREPLIED' },
];

export const feeSettings = [
  { marketplace: 'SHOPEE', country: 'SG', marketplaceFee: 10, paymentFee: 2, payoutProvider: payoutDefaults.SHOPEE, payoutFee: 2, fixedFee: 0, otherCost: 100 },
  { marketplace: 'SHOPEE', country: 'TW', marketplaceFee: 10, paymentFee: 2, payoutProvider: payoutDefaults.SHOPEE, payoutFee: 2, fixedFee: 0, otherCost: 100 },
  { marketplace: 'LAZADA', country: 'MY', marketplaceFee: 8, paymentFee: 2, payoutProvider: payoutDefaults.LAZADA, payoutFee: 1.5, fixedFee: 0, otherCost: 100 },
];

export const marketPriceSamples = [
  { marketplace: 'SHOPEE', country: 'TW', asin: 'B00MG84XN4', range: 'TWD 850〜1,050', median: 980, soldCount: 120, note: 'レビュー多めの価格帯' },
  { marketplace: 'SHOPEE', country: 'SG', asin: 'B09S3N7WCJ', range: 'SGD 24〜32', median: 28.9, soldCount: 84, note: '食品系は送料要確認' },
  { marketplace: 'LAZADA', country: 'MY', asin: 'B074MX813G', range: 'MYR 42〜55', median: 45.9, soldCount: 61, note: 'World First受取想定' },
];
