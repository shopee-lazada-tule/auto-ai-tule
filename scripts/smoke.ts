import { calculateProfit } from '../lib/profit';
import { countriesByMarketplace, payoutDefaults } from '../lib/constants';

const result = calculateProfit({ sellingPriceLocal: 1200, exchangeRate: 4.99, amazonCostJpy: 3980, marketplaceFeeRate: 10, paymentFeeRate: 2, payoutFeeRate: 2, otherCostJpy: 100, internationalShippingJpy: null });
if (!result.allowableShippingJpy || result.allowableShippingJpy <= 0) throw new Error('allowable shipping calculation failed');
if (countriesByMarketplace.SHOPEE.includes('ID' as any)) throw new Error('Shopee ID should not be enabled by default');
if (payoutDefaults.LAZADA !== 'WORLD_FIRST') throw new Error('LAZADA default payout provider should be World First');
console.log('smoke ok', { profit: result.profitJpy, allowableShipping: result.allowableShippingJpy });
