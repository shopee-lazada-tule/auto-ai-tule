import type { Country, Marketplace } from './constants';

export type ProfitInput = {
  marketplace?: Marketplace;
  country?: Country;
  sellingPriceLocal: number;
  exchangeRate: number;
  amazonCostJpy: number;
  marketplaceFeeRate: number;
  paymentFeeRate: number;
  payoutFeeRate: number;
  payoutFixedFeeJpy?: number;
  domesticShippingJpy?: number;
  internationalShippingJpy?: number | null;
  packingCostJpy?: number;
  otherCostJpy?: number;
  targetProfitJpy?: number;
};

export type ProfitResult = {
  salesJpy: number;
  marketplaceFeeJpy: number;
  paymentFeeJpy: number;
  payoutFeeJpy: number;
  payoutFixedFeeJpy: number;
  subtotalCostJpy: number;
  profitJpy: number;
  profitRate: number;
  allowableShippingJpy: number | null;
  judgement: 'A' | 'B' | 'C' | 'D' | 'TEMP_OK' | 'NEED_CHECK' | 'NG';
};

export function calculateProfit(input: ProfitInput): ProfitResult {
  const salesJpy = Math.round(input.sellingPriceLocal * input.exchangeRate);
  const marketplaceFeeJpy = Math.round(salesJpy * input.marketplaceFeeRate / 100);
  const paymentFeeJpy = Math.round(salesJpy * input.paymentFeeRate / 100);
  const payoutFeeJpy = Math.round(salesJpy * input.payoutFeeRate / 100);
  const payoutFixedFeeJpy = input.payoutFixedFeeJpy ?? 0;
  const domesticShippingJpy = input.domesticShippingJpy ?? 0;
  const packingCostJpy = input.packingCostJpy ?? 0;
  const otherCostJpy = input.otherCostJpy ?? 0;
  const internationalShippingKnown = input.internationalShippingJpy !== null && input.internationalShippingJpy !== undefined;
  const internationalShippingJpy = input.internationalShippingJpy ?? 0;

  const subtotalCostJpy = input.amazonCostJpy + domesticShippingJpy + internationalShippingJpy + packingCostJpy + marketplaceFeeJpy + paymentFeeJpy + payoutFeeJpy + payoutFixedFeeJpy + otherCostJpy;
  const profitJpy = salesJpy - subtotalCostJpy;
  const profitRate = salesJpy > 0 ? Math.round((profitJpy / salesJpy) * 1000) / 10 : 0;
  const targetProfitJpy = input.targetProfitJpy ?? 500;
  const allowableShippingJpy = internationalShippingKnown ? null : salesJpy - (subtotalCostJpy - internationalShippingJpy) - targetProfitJpy;

  let judgement: ProfitResult['judgement'];
  if (profitJpy < 0 && (allowableShippingJpy ?? -1) < 0) judgement = 'NG';
  else if (!internationalShippingKnown && (allowableShippingJpy ?? 0) > 0) judgement = 'C';
  else if (profitRate >= 20 && profitJpy >= 800) judgement = 'A';
  else if (profitRate >= 10 && profitJpy >= 300) judgement = 'B';
  else if (profitJpy > 0) judgement = 'D';
  else judgement = 'NEED_CHECK';

  return { salesJpy, marketplaceFeeJpy, paymentFeeJpy, payoutFeeJpy, payoutFixedFeeJpy, subtotalCostJpy, profitJpy, profitRate, allowableShippingJpy, judgement };
}
