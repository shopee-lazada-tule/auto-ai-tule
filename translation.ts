import { getPrisma } from './db';
import {
  countriesByMarketplace,
  currencyByCountry,
  payoutDefaults,
  type Country,
  type FxLockTiming,
  type Marketplace,
  type PayoutProvider,
} from './constants';
import { feeSettings as seedFeeSettings, products as seedProducts } from './mockData';
import { calculateProfit } from './profit';

const DEMO_USER_ID = 'demo-user';
const DEMO_USER_EMAIL = 'demo@auto-ai-tule.local';

type DataSource = 'SP_API' | 'KEEPA' | 'MANUAL';
type Judgement = 'A' | 'B' | 'C' | 'D' | 'TEMP_OK' | 'NEED_CHECK' | 'NG';
type ListingStatus = 'DRAFT' | 'CANDIDATE' | 'NEED_CHECK' | 'READY' | 'UPLOAD_WAITING' | 'UPLOADED' | 'UPDATED' | 'ERROR' | 'STOPPED';

export type ProductItem = {
  id: string;
  asin: string;
  amazonUrl: string | null;
  title: string;
  brand: string | null;
  category: string | null;
  description: string | null;
  amazonPriceJpy: number | null;
  price: number;
  primeAvailable: boolean;
  stockAvailable: boolean;
  weightKg: number | null;
  weight: number | null;
  lengthCm: number | null;
  widthCm: number | null;
  heightCm: number | null;
  imageUrls: string[];
  imageCount: number;
  dataSource: DataSource;
  source: DataSource;
  createdAt: string;
  updatedAt: string;
};

export type ListingDraftItem = {
  id: string;
  amazonProductId: string;
  asin: string;
  title: string;
  marketplace: Marketplace;
  country: Country;
  currency: string;
  selectedForListing: boolean;
  selected: boolean;
  sku: string;
  priceLocal: number | null;
  recommendedPrice: number | null;
  stock: number;
  judgement: Judgement;
  status: ListingStatus;
  profitJpy: number | null;
  allowableShippingJpy: number | null;
  titleLanguage: string | null;
  descriptionLanguage: string | null;
};

export type FeeSettingItem = {
  id: string;
  marketplace: Marketplace;
  country: Country;
  marketplaceFeeRate: number;
  paymentFeeRate: number;
  payoutProvider: PayoutProvider;
  payoutFeeRate: number;
  payoutFixedFeeJpy: number;
  otherCostJpy: number;
};

export type FxLockSettingItem = {
  id: string;
  marketplace: Marketplace;
  country: Country;
  lockTiming: FxLockTiming;
};

type StoredProduct = ProductItem & { userId: string };
type StoredListingDraft = Omit<ListingDraftItem, 'asin' | 'title' | 'selected' | 'recommendedPrice'> & {
  userId: string;
  createdAt: string;
  updatedAt: string;
};
type StoreState = {
  products: StoredProduct[];
  listingDrafts: StoredListingDraft[];
  feeSettings: FeeSettingItem[];
  fxLockSettings: FxLockSettingItem[];
};

const globalForStore = globalThis as unknown as { autoAiTuleStore?: StoreState };

const priceByCountry: Record<Marketplace, Record<Country, number>> = {
  SHOPEE: { SG: 32.9, MY: 99, PH: 1299, TH: 899, TW: 980, VN: 499000, ID: 0 },
  LAZADA: { SG: 31.5, MY: 96, PH: 1240, TH: 870, TW: 0, VN: 489000, ID: 159000 },
};

const exchangeRateByCountry: Record<Country, number> = {
  SG: 122.1,
  MY: 38,
  PH: 2.6,
  TH: 4.76,
  TW: 5,
  VN: 0.006,
  ID: 0.0097,
};

function nowIso() {
  return new Date().toISOString();
}

function normalizeAsin(value: unknown) {
  return String(value ?? '').trim().toUpperCase();
}

function extractAsinFromUrl(value: unknown) {
  const text = String(value ?? '');
  const match = text.match(/(?:\/dp\/|\/gp\/product\/|\/)([A-Z0-9]{10})(?:[/?#]|$)/i);
  return match?.[1]?.toUpperCase() ?? '';
}

function text(value: unknown, fallback = '') {
  const next = String(value ?? '').trim();
  return next || fallback;
}

function nullableText(value: unknown) {
  const next = String(value ?? '').trim();
  return next || null;
}

function numberOrNull(value: unknown) {
  if (value === null || value === undefined || value === '') return null;
  const next = Number(value);
  return Number.isFinite(next) ? next : null;
}

function intOrNull(value: unknown) {
  const next = numberOrNull(value);
  return next === null ? null : Math.round(next);
}

function bool(value: unknown, fallback = false) {
  if (typeof value === 'boolean') return value;
  if (value === 'true') return true;
  if (value === 'false') return false;
  return fallback;
}

function dataSource(value: unknown): DataSource {
  return value === 'SP_API' || value === 'KEEPA' || value === 'MANUAL' ? value : 'MANUAL';
}

function marketplace(value: unknown): Marketplace {
  return value === 'LAZADA' ? 'LAZADA' : 'SHOPEE';
}

function country(value: unknown): Country | null {
  return value === 'SG' || value === 'MY' || value === 'PH' || value === 'TH' || value === 'TW' || value === 'VN' || value === 'ID' ? value : null;
}

function payoutProvider(value: unknown): PayoutProvider {
  return value === 'WORLD_FIRST' || value === 'OTHER' || value === 'PAYONEER' ? value : 'PAYONEER';
}

function fxLockTiming(value: unknown): FxLockTiming {
  return value === 'ORDER_CREATED' ? 'ORDER_CREATED' : 'SHIPPED';
}

function imageUrls(value: unknown) {
  if (Array.isArray(value)) return value.map(item => String(item).trim()).filter(Boolean);
  return String(value ?? '')
    .split(/\r?\n|,/)
    .map(item => item.trim())
    .filter(Boolean);
}

function getStore(): StoreState {
  if (!globalForStore.autoAiTuleStore) {
    const products = seedProducts.map((product, index): StoredProduct => {
      const createdAt = nowIso();
      const images = Array.from({ length: product.imageCount }, (_, imageIndex) => `https://example.invalid/${product.asin}/${imageIndex + 1}.jpg`);
      return {
        id: `mem-product-${index + 1}`,
        userId: DEMO_USER_ID,
        asin: product.asin,
        amazonUrl: `https://www.amazon.co.jp/dp/${product.asin}`,
        title: product.title,
        brand: null,
        category: null,
        description: null,
        amazonPriceJpy: product.price,
        price: product.price,
        primeAvailable: product.prime,
        stockAvailable: product.stock,
        weightKg: product.weight,
        weight: product.weight,
        lengthCm: null,
        widthCm: null,
        heightCm: null,
        imageUrls: images,
        imageCount: images.length,
        dataSource: product.source as DataSource,
        source: product.source as DataSource,
        createdAt,
        updatedAt: createdAt,
      };
    });
    globalForStore.autoAiTuleStore = {
      products,
      listingDrafts: createDraftsForProducts(products.slice(0, 1), 'SHOPEE', true),
      feeSettings: seedFeeSettings.map((setting, index) => ({
        id: `mem-fee-${index + 1}`,
        marketplace: setting.marketplace as Marketplace,
        country: setting.country as Country,
        marketplaceFeeRate: setting.marketplaceFee,
        paymentFeeRate: setting.paymentFee,
        payoutProvider: setting.payoutProvider,
        payoutFeeRate: setting.payoutFee,
        payoutFixedFeeJpy: setting.fixedFee,
        otherCostJpy: setting.otherCost,
      })),
      fxLockSettings: Object.entries(countriesByMarketplace).flatMap(([market, countries]) =>
        countries.map(nextCountry => ({
          id: `mem-fx-${market}-${nextCountry}`,
          marketplace: market as Marketplace,
          country: nextCountry,
          lockTiming: 'SHIPPED' as FxLockTiming,
        })),
      ),
    };
  }
  return globalForStore.autoAiTuleStore as StoreState;
}

function makeProductInput(body: Record<string, unknown>) {
  const asin = normalizeAsin(body.asin) || extractAsinFromUrl(body.amazonUrl);
  const images = imageUrls(body.imageUrls ?? body.imageUrl);
  return {
    asin,
    amazonUrl: nullableText(body.amazonUrl),
    title: text(body.title, asin),
    brand: nullableText(body.brand),
    category: nullableText(body.category),
    description: nullableText(body.description),
    amazonPriceJpy: intOrNull(body.amazonPriceJpy ?? body.price),
    primeAvailable: bool(body.primeAvailable ?? body.prime, false),
    stockAvailable: bool(body.stockAvailable ?? body.stock, true),
    weightKg: numberOrNull(body.weightKg ?? body.weight),
    lengthCm: numberOrNull(body.lengthCm),
    widthCm: numberOrNull(body.widthCm),
    heightCm: numberOrNull(body.heightCm),
    imageUrls: images,
    dataSource: dataSource(body.dataSource ?? body.source),
  };
}

function productDto(item: any): ProductItem {
  const images = imageUrls(item.imageUrls);
  const createdAt = item.createdAt instanceof Date ? item.createdAt.toISOString() : String(item.createdAt ?? nowIso());
  const updatedAt = item.updatedAt instanceof Date ? item.updatedAt.toISOString() : String(item.updatedAt ?? createdAt);
  return {
    id: String(item.id),
    asin: item.asin,
    amazonUrl: item.amazonUrl ?? null,
    title: item.title,
    brand: item.brand ?? null,
    category: item.category ?? null,
    description: item.description ?? null,
    amazonPriceJpy: item.amazonPriceJpy ?? null,
    price: item.amazonPriceJpy ?? item.price ?? 0,
    primeAvailable: Boolean(item.primeAvailable),
    stockAvailable: Boolean(item.stockAvailable),
    weightKg: item.weightKg ?? null,
    weight: item.weightKg ?? item.weight ?? null,
    lengthCm: item.lengthCm ?? null,
    widthCm: item.widthCm ?? null,
    heightCm: item.heightCm ?? null,
    imageUrls: images,
    imageCount: images.length || item.imageCount || 0,
    dataSource: dataSource(item.dataSource ?? item.source),
    source: dataSource(item.dataSource ?? item.source),
    createdAt,
    updatedAt,
  };
}

function listingDraftDto(item: any, product?: ProductItem): ListingDraftItem {
  const sourceProduct = product ?? productDto(item.product ?? {});
  const priceLocal = item.priceLocal ?? item.recommendedPrice ?? null;
  return {
    id: String(item.id),
    amazonProductId: String(item.amazonProductId),
    asin: sourceProduct.asin,
    title: sourceProduct.title,
    marketplace: item.marketplace,
    country: item.country,
    currency: item.currency ?? currencyByCountry[item.country as Country],
    selectedForListing: Boolean(item.selectedForListing),
    selected: Boolean(item.selectedForListing),
    sku: item.sku ?? `${sourceProduct.asin}-${item.marketplace}-${item.country}`,
    priceLocal,
    recommendedPrice: priceLocal,
    stock: item.stock ?? 1,
    judgement: item.judgement ?? 'NEED_CHECK',
    status: item.status ?? 'DRAFT',
    profitJpy: item.profitJpy ?? null,
    allowableShippingJpy: item.allowableShippingJpy ?? null,
    titleLanguage: item.titleLanguage ?? null,
    descriptionLanguage: item.descriptionLanguage ?? null,
  };
}

function draftForProduct(product: ProductItem, nextMarketplace: Marketplace, nextCountry: Country, selectedForListing = false): StoredListingDraft {
  const priceLocal = priceByCountry[nextMarketplace][nextCountry];
  const result = calculateProfit({
    marketplace: nextMarketplace,
    country: nextCountry,
    sellingPriceLocal: priceLocal,
    exchangeRate: exchangeRateByCountry[nextCountry],
    amazonCostJpy: product.amazonPriceJpy ?? product.price ?? 0,
    marketplaceFeeRate: nextMarketplace === 'SHOPEE' ? 10 : 8,
    paymentFeeRate: 2,
    payoutFeeRate: nextMarketplace === 'SHOPEE' ? 2 : 1.5,
    otherCostJpy: 100,
    internationalShippingJpy: null,
    targetProfitJpy: 500,
  });
  const timestamp = nowIso();
  return {
    id: `mem-draft-${product.id}-${nextMarketplace}-${nextCountry}`,
    userId: DEMO_USER_ID,
    amazonProductId: product.id,
    marketplace: nextMarketplace,
    country: nextCountry,
    currency: currencyByCountry[nextCountry],
    selectedForListing,
    sku: `${product.asin}-${nextMarketplace}-${nextCountry}`,
    priceLocal,
    stock: product.stockAvailable ? 1 : 0,
    judgement: product.stockAvailable ? result.judgement : 'NEED_CHECK',
    status: product.stockAvailable ? 'CANDIDATE' : 'NEED_CHECK',
    profitJpy: result.profitJpy,
    allowableShippingJpy: result.allowableShippingJpy,
    titleLanguage: 'en',
    descriptionLanguage: 'en',
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

function createDraftsForProducts(products: ProductItem[], nextMarketplace: Marketplace, seedSelection = false) {
  return products.flatMap(product =>
    countriesByMarketplace[nextMarketplace].map((nextCountry, index) =>
      draftForProduct(product, nextMarketplace, nextCountry, seedSelection && index < 2),
    ),
  );
}

async function ensureDemoUser(prisma: NonNullable<ReturnType<typeof getPrisma>>) {
  return prisma.user.upsert({
    where: { email: DEMO_USER_EMAIL },
    update: {},
    create: { id: DEMO_USER_ID, email: DEMO_USER_EMAIL, name: 'Demo User' },
  });
}

async function withDatabase<T, F>(operation: (prisma: NonNullable<ReturnType<typeof getPrisma>>) => Promise<T>, fallback: () => F | Promise<F>): Promise<T | F> {
  const prisma = getPrisma();
  if (!prisma) return fallback();
  try {
    await ensureDemoUser(prisma);
    return await operation(prisma);
  } catch {
    return fallback();
  }
}

export async function listProducts(params: URLSearchParams) {
  const q = text(params.get('q')).toLowerCase();
  const source = dataSource(params.get('source'));
  const hasSource = params.has('source') && params.get('source') !== 'ALL';
  const page = Math.max(1, Number(params.get('page') ?? 1));
  const pageSize = Math.min(100, Math.max(10, Number(params.get('pageSize') ?? 50)));
  const skip = (page - 1) * pageSize;

  return withDatabase(
    async prisma => {
      const where: any = { userId: DEMO_USER_ID };
      if (hasSource) where.dataSource = source;
      if (q) {
        where.OR = [
          { asin: { contains: q, mode: 'insensitive' } },
          { title: { contains: q, mode: 'insensitive' } },
          { brand: { contains: q, mode: 'insensitive' } },
        ];
      }
      const [items, total] = await Promise.all([
        prisma.amazonProduct.findMany({ where, orderBy: { updatedAt: 'desc' }, skip, take: pageSize }),
        prisma.amazonProduct.count({ where }),
      ]);
      return { items: items.map(productDto), total, page, pageSize, storage: 'prisma' as const };
    },
    () => {
      const store = getStore();
      const filtered = store.products.filter(product => {
        const qOk = !q || [product.asin, product.title, product.brand, product.category, product.dataSource].some(value => String(value ?? '').toLowerCase().includes(q));
        const sourceOk = !hasSource || product.dataSource === source;
        return qOk && sourceOk;
      });
      return { items: filtered.slice(skip, skip + pageSize).map(productDto), total: filtered.length, page, pageSize, storage: 'memory' as const };
    },
  );
}

export async function saveProduct(body: Record<string, unknown>) {
  const input = makeProductInput(body);
  if (!input.asin) throw new Error('ASIN is required');
  return withDatabase(
    async prisma => {
      const saved = await prisma.amazonProduct.upsert({
        where: { userId_asin: { userId: DEMO_USER_ID, asin: input.asin } },
        update: {
          amazonUrl: input.amazonUrl,
          title: input.title,
          brand: input.brand,
          category: input.category,
          description: input.description,
          amazonPriceJpy: input.amazonPriceJpy,
          primeAvailable: input.primeAvailable,
          stockAvailable: input.stockAvailable,
          weightKg: input.weightKg,
          lengthCm: input.lengthCm,
          widthCm: input.widthCm,
          heightCm: input.heightCm,
          imageUrls: input.imageUrls,
          dataSource: input.dataSource,
        },
        create: {
          userId: DEMO_USER_ID,
          asin: input.asin,
          amazonUrl: input.amazonUrl,
          title: input.title,
          brand: input.brand,
          category: input.category,
          description: input.description,
          amazonPriceJpy: input.amazonPriceJpy,
          primeAvailable: input.primeAvailable,
          stockAvailable: input.stockAvailable,
          weightKg: input.weightKg,
          lengthCm: input.lengthCm,
          widthCm: input.widthCm,
          heightCm: input.heightCm,
          imageUrls: input.imageUrls,
          dataSource: input.dataSource,
        },
      } as any);
      return { item: productDto(saved), storage: 'prisma' as const };
    },
    () => {
      const store = getStore();
      const existing = store.products.find(product => product.asin === input.asin);
      const timestamp = nowIso();
      const item: StoredProduct = {
        id: existing?.id ?? `mem-product-${crypto.randomUUID()}`,
        userId: DEMO_USER_ID,
        asin: input.asin,
        amazonUrl: input.amazonUrl,
        title: input.title,
        brand: input.brand,
        category: input.category,
        description: input.description,
        amazonPriceJpy: input.amazonPriceJpy,
        price: input.amazonPriceJpy ?? 0,
        primeAvailable: input.primeAvailable,
        stockAvailable: input.stockAvailable,
        weightKg: input.weightKg,
        weight: input.weightKg,
        lengthCm: input.lengthCm,
        widthCm: input.widthCm,
        heightCm: input.heightCm,
        imageUrls: input.imageUrls,
        imageCount: input.imageUrls.length,
        dataSource: input.dataSource,
        source: input.dataSource,
        createdAt: existing?.createdAt ?? timestamp,
        updatedAt: timestamp,
      };
      if (existing) Object.assign(existing, item);
      else store.products.unshift(item);
      return { item: productDto(item), storage: 'memory' as const };
    },
  );
}

export async function generateListingDrafts(body: Record<string, unknown>) {
  const nextMarketplace = marketplace(body.marketplace);
  const asin = normalizeAsin(body.asin);
  const productId = nullableText(body.productId);

  return withDatabase(
    async prisma => {
      const where: any = { userId: DEMO_USER_ID };
      if (productId) where.id = productId;
      if (asin) where.asin = asin;
      const dbProducts = await prisma.amazonProduct.findMany({ where, orderBy: { updatedAt: 'desc' }, take: 500 });
      const saved = [];
      for (const dbProduct of dbProducts) {
        const dto = productDto(dbProduct);
        for (const nextCountry of countriesByMarketplace[nextMarketplace]) {
          const draft = draftForProduct(dto, nextMarketplace, nextCountry);
          const item = await prisma.listingDraft.upsert({
            where: {
              userId_amazonProductId_marketplace_country: {
                userId: DEMO_USER_ID,
                amazonProductId: dbProduct.id,
                marketplace: nextMarketplace,
                country: nextCountry,
              },
            },
            update: {
              title: `${dto.title} Direct from Japan`,
              description: dto.description,
              priceLocal: draft.priceLocal,
              currency: draft.currency,
              stock: draft.stock,
              sku: draft.sku,
              weightKg: dto.weightKg,
              lengthCm: dto.lengthCm,
              widthCm: dto.widthCm,
              heightCm: dto.heightCm,
              imageUrls: dto.imageUrls,
              judgement: draft.judgement,
              status: draft.status,
            },
            create: {
              userId: DEMO_USER_ID,
              amazonProductId: dbProduct.id,
              marketplace: nextMarketplace,
              country: nextCountry,
              selectedForListing: false,
              title: `${dto.title} Direct from Japan`,
              titleLanguage: 'en',
              description: dto.description,
              descriptionLanguage: 'en',
              priceLocal: draft.priceLocal,
              currency: draft.currency,
              stock: draft.stock,
              sku: draft.sku,
              weightKg: dto.weightKg,
              lengthCm: dto.lengthCm,
              widthCm: dto.widthCm,
              heightCm: dto.heightCm,
              imageUrls: dto.imageUrls,
              judgement: draft.judgement,
              status: draft.status,
            },
            include: { product: true },
          } as any);
          saved.push(listingDraftDto({ ...item, profitJpy: draft.profitJpy, allowableShippingJpy: draft.allowableShippingJpy }));
        }
      }
      return { items: saved, generatedCount: saved.length, generatedCountries: countriesByMarketplace[nextMarketplace], storage: 'prisma' as const };
    },
    () => {
      const store = getStore();
      const targets = store.products.filter(product => (!productId || product.id === productId) && (!asin || product.asin === asin));
      const sourceProducts = targets.length ? targets : store.products;
      const generated = createDraftsForProducts(sourceProducts, nextMarketplace, false);
      for (const draft of generated) {
        const existing = store.listingDrafts.find(
          item => item.amazonProductId === draft.amazonProductId && item.marketplace === draft.marketplace && item.country === draft.country,
        );
        if (existing) Object.assign(existing, { ...draft, selectedForListing: existing.selectedForListing, createdAt: existing.createdAt, updatedAt: nowIso() });
        else store.listingDrafts.push(draft);
      }
      const items = generated.map(draft => listingDraftDto(draft, store.products.find(product => product.id === draft.amazonProductId)));
      return { items, generatedCount: items.length, generatedCountries: countriesByMarketplace[nextMarketplace], storage: 'memory' as const };
    },
  );
}

export async function listListingDrafts(params: URLSearchParams) {
  const nextMarketplace = marketplace(params.get('marketplace'));
  const q = text(params.get('q')).toLowerCase();
  const selectedParam = params.get('selectedForListing') ?? params.get('selected_for_listing');
  const selectedOnly = selectedParam === 'true' ? true : selectedParam === 'false' ? false : null;
  const page = Math.max(1, Number(params.get('page') ?? 1));
  const pageSize = Math.min(500, Math.max(10, Number(params.get('pageSize') ?? 50)));
  const skip = (page - 1) * pageSize;

  return withDatabase(
    async prisma => {
      const where: any = { userId: DEMO_USER_ID, marketplace: nextMarketplace };
      if (selectedOnly !== null) where.selectedForListing = selectedOnly;
      if (q) {
        where.OR = [
          { sku: { contains: q, mode: 'insensitive' } },
          { product: { is: { asin: { contains: q, mode: 'insensitive' } } } },
          { product: { is: { title: { contains: q, mode: 'insensitive' } } } },
        ];
      }
      const [items, total] = await Promise.all([
        prisma.listingDraft.findMany({ where, include: { product: true }, orderBy: [{ updatedAt: 'desc' }], skip, take: pageSize } as any),
        prisma.listingDraft.count({ where } as any),
      ]);
      return { items: items.map(item => listingDraftDto(item)), total, page, pageSize, storage: 'prisma' as const };
    },
    () => {
      const store = getStore();
      const rows = store.listingDrafts
        .filter(draft => draft.marketplace === nextMarketplace)
        .map(draft => listingDraftDto(draft, store.products.find(product => product.id === draft.amazonProductId)))
        .filter(draft => {
          const qOk = !q || [draft.asin, draft.title, draft.sku, draft.country, draft.judgement, draft.status].some(value => String(value).toLowerCase().includes(q));
          const selectedOk = selectedOnly === null || draft.selectedForListing === selectedOnly;
          return qOk && selectedOk;
        });
      return { items: rows.slice(skip, skip + pageSize), total: rows.length, page, pageSize, storage: 'memory' as const };
    },
  );
}

export async function updateListingDraftSelection(body: Record<string, unknown>) {
  const ids = Array.isArray(body.ids) ? body.ids.map(String) : [String(body.id ?? '')].filter(Boolean);
  const selectedForListing = bool(body.selectedForListing ?? body.selected_for_listing, false);
  return withDatabase(
    async prisma => {
      const result = await prisma.listingDraft.updateMany({ where: { userId: DEMO_USER_ID, id: { in: ids } }, data: { selectedForListing } });
      return { updatedCount: result.count, selectedForListing, storage: 'prisma' as const };
    },
    () => {
      const store = getStore();
      let updatedCount = 0;
      for (const draft of store.listingDrafts) {
        if (ids.includes(draft.id)) {
          draft.selectedForListing = selectedForListing;
          draft.updatedAt = nowIso();
          updatedCount += 1;
        }
      }
      return { updatedCount, selectedForListing, storage: 'memory' as const };
    },
  );
}

export async function listFeeSettings(params: URLSearchParams) {
  const nextMarketplace = params.get('marketplace') ? marketplace(params.get('marketplace')) : null;
  return withDatabase(
    async prisma => {
      const where: any = { userId: DEMO_USER_ID };
      if (nextMarketplace) where.marketplace = nextMarketplace;
      const items = await prisma.feeSetting.findMany({ where, orderBy: [{ marketplace: 'asc' }, { country: 'asc' }] });
      return { items: items.map(feeSettingDto), storage: 'prisma' as const };
    },
    () => {
      const items = getStore().feeSettings.filter(item => !nextMarketplace || item.marketplace === nextMarketplace);
      return { items, storage: 'memory' as const };
    },
  );
}

function feeSettingDto(item: any): FeeSettingItem {
  return {
    id: String(item.id),
    marketplace: item.marketplace,
    country: item.country,
    marketplaceFeeRate: Number(item.marketplaceFeeRate ?? item.marketplaceFee ?? 0),
    paymentFeeRate: Number(item.paymentFeeRate ?? item.paymentFee ?? 0),
    payoutProvider: payoutProvider(item.payoutProvider),
    payoutFeeRate: Number(item.payoutFeeRate ?? item.payoutFee ?? 0),
    payoutFixedFeeJpy: Number(item.payoutFixedFeeJpy ?? item.fixedFee ?? 0),
    otherCostJpy: Number(item.otherCostJpy ?? item.otherCost ?? 0),
  };
}

export async function saveFeeSetting(body: Record<string, unknown>) {
  const nextMarketplace = marketplace(body.marketplace);
  const nextCountry = country(body.country);
  if (!nextCountry || !countriesByMarketplace[nextMarketplace].includes(nextCountry)) throw new Error('Invalid country');
  const input = {
    marketplace: nextMarketplace,
    country: nextCountry,
    marketplaceFeeRate: Number(numberOrNull(body.marketplaceFeeRate ?? body.marketplaceFee) ?? 0),
    paymentFeeRate: Number(numberOrNull(body.paymentFeeRate ?? body.paymentFee) ?? 0),
    payoutProvider: payoutProvider(body.payoutProvider),
    payoutFeeRate: Number(numberOrNull(body.payoutFeeRate ?? body.payoutFee) ?? 0),
    payoutFixedFeeJpy: Number(intOrNull(body.payoutFixedFeeJpy ?? body.fixedFee) ?? 0),
    otherCostJpy: Number(intOrNull(body.otherCostJpy ?? body.otherCost) ?? 0),
  };
  return withDatabase(
    async prisma => {
      const item = await prisma.feeSetting.upsert({
        where: { userId_marketplace_country: { userId: DEMO_USER_ID, marketplace: input.marketplace, country: input.country } },
        update: input,
        create: { userId: DEMO_USER_ID, ...input },
      } as any);
      return { item: feeSettingDto(item), storage: 'prisma' as const };
    },
    () => {
      const store = getStore();
      const existing = store.feeSettings.find(item => item.marketplace === input.marketplace && item.country === input.country);
      const item = { id: existing?.id ?? `mem-fee-${crypto.randomUUID()}`, ...input };
      if (existing) Object.assign(existing, item);
      else store.feeSettings.push(item);
      return { item, storage: 'memory' as const };
    },
  );
}

export async function listFxLockSettings(params: URLSearchParams) {
  const nextMarketplace = params.get('marketplace') ? marketplace(params.get('marketplace')) : null;
  return withDatabase(
    async prisma => {
      const where: any = { userId: DEMO_USER_ID };
      if (nextMarketplace) where.marketplace = nextMarketplace;
      const items = await prisma.fxLockSetting.findMany({ where, orderBy: [{ marketplace: 'asc' }, { country: 'asc' }] });
      const normalized = items.map((item: any) => ({
        id: String(item.id),
        marketplace: item.marketplace,
        country: item.country,
        lockTiming: fxLockTiming(item.lockTiming),
      }));
      return { items: normalized, lockTiming: normalized[0]?.lockTiming ?? 'SHIPPED', storage: 'prisma' as const };
    },
    () => {
      const items = getStore().fxLockSettings.filter(item => !nextMarketplace || item.marketplace === nextMarketplace);
      return { items, lockTiming: items[0]?.lockTiming ?? 'SHIPPED', storage: 'memory' as const };
    },
  );
}

export async function saveFxLockSetting(body: Record<string, unknown>) {
  const nextMarketplace = marketplace(body.marketplace);
  const nextCountry = country(body.country);
  if (!nextCountry || !countriesByMarketplace[nextMarketplace].includes(nextCountry)) throw new Error('Invalid country');
  const input = { marketplace: nextMarketplace, country: nextCountry, lockTiming: fxLockTiming(body.lockTiming) };
  return withDatabase(
    async prisma => {
      const item = await prisma.fxLockSetting.upsert({
        where: { userId_marketplace_country: { userId: DEMO_USER_ID, marketplace: input.marketplace, country: input.country } },
        update: { lockTiming: input.lockTiming },
        create: { userId: DEMO_USER_ID, ...input },
      } as any);
      return { item: { id: String(item.id), ...input }, storage: 'prisma' as const };
    },
    () => {
      const store = getStore();
      const existing = store.fxLockSettings.find(item => item.marketplace === input.marketplace && item.country === input.country);
      const item = { id: existing?.id ?? `mem-fx-${crypto.randomUUID()}`, ...input };
      if (existing) Object.assign(existing, item);
      else store.fxLockSettings.push(item);
      return { item, storage: 'memory' as const };
    },
  );
}

export async function selectedListingCsvRows(nextMarketplace: Marketplace, type: 'NEW_LISTING' | 'NEED_CHECK_ONLY' | 'ERROR_ONLY' = 'NEW_LISTING') {
  const result = await listListingDrafts(new URLSearchParams({ marketplace: nextMarketplace, selectedForListing: 'true', pageSize: '500' }));
  const filtered = result.items.filter(item => {
    if (type === 'NEED_CHECK_ONLY') return item.judgement === 'NEED_CHECK' || item.status === 'NEED_CHECK';
    if (type === 'ERROR_ONLY') return item.status === 'ERROR';
    return true;
  });
  return filtered.map(item => ({
    Marketplace: item.marketplace,
    Country: item.country,
    ASIN: item.asin,
    SKU: item.sku,
    ProductName: `${item.title} Direct from Japan`,
    Description: 'Direct from Japan. Please check product details before purchase.',
    Currency: item.currency,
    Price: item.priceLocal ?? '',
    Stock: item.stock,
    CategoryId: '',
    WeightKg: '',
    LengthCm: '',
    WidthCm: '',
    HeightCm: '',
  }));
}

export function defaultPayoutProvider(nextMarketplace: Marketplace) {
  return payoutDefaults[nextMarketplace];
}
