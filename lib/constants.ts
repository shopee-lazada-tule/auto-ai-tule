export type Marketplace = 'SHOPEE' | 'LAZADA';
export type Country = 'SG' | 'MY' | 'PH' | 'TH' | 'TW' | 'VN' | 'ID';
export type PayoutProvider = 'PAYONEER' | 'WORLD_FIRST' | 'OTHER';
export type FxLockTiming = 'ORDER_CREATED' | 'SHIPPED';

export const marketplaceLabel: Record<Marketplace, string> = {
  SHOPEE: 'Shopee',
  LAZADA: 'LAZADA',
};

export const countryLabels: Record<Country, string> = {
  SG: 'シンガポール',
  MY: 'マレーシア',
  PH: 'フィリピン',
  TH: 'タイ',
  TW: '台湾',
  VN: 'ベトナム',
  ID: 'インドネシア',
};

export const countriesByMarketplace: Record<Marketplace, Country[]> = {
  SHOPEE: ['SG', 'MY', 'PH', 'TH', 'TW', 'VN'],
  LAZADA: ['SG', 'MY', 'PH', 'TH', 'VN', 'ID'],
};

export const currencyByCountry: Record<Country, string> = {
  SG: 'SGD',
  MY: 'MYR',
  PH: 'PHP',
  TH: 'THB',
  TW: 'TWD',
  VN: 'VND',
  ID: 'IDR',
};

export const localLanguageByCountry: Record<Country, string> = {
  SG: 'en',
  MY: 'en',
  PH: 'en',
  TH: 'th',
  TW: 'zh-TW',
  VN: 'vi',
  ID: 'id',
};

export const payoutDefaults: Record<Marketplace, PayoutProvider> = {
  SHOPEE: 'PAYONEER',
  LAZADA: 'WORLD_FIRST',
};

export const payoutProviderLabels: Record<PayoutProvider, string> = {
  PAYONEER: 'Payoneer',
  WORLD_FIRST: 'World First',
  OTHER: 'その他',
};

export const navigation = [
  { href: '/', label: 'ダッシュボード', description: '状況確認のみ' },
  { href: '/products', label: '商品登録', description: 'ASIN登録・商品マスタ' },
  { href: '/listing-drafts', label: '出品候補', description: '国別選択・候補確定' },
  { href: '/active-listings', label: '出品中商品', description: '価格・在庫更新' },
  { href: '/sold-items', label: '販売済み', description: '注文・発送・利益予測' },
  { href: '/sales', label: '売上管理', description: '着金・差額確認' },
  { href: '/profit', label: '価格帯・利益判定', description: '売れ筋価格帯・許容送料' },
  { href: '/automation', label: '自動更新', description: '更新・アップロード設定' },
  { href: '/messages', label: 'メッセージ', description: '未返信・返信案' },
  { href: '/csv', label: 'CSV', description: '大量出品・一括更新' },
  { href: '/settings', label: '設定', description: '手数料・API・為替固定' },
] as const;
