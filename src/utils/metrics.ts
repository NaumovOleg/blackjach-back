import { Channel, RateCard, MediaPlan, BUYING_METRICS, CalculatedMetrics } from '@skyrise-eng/types';

const getBuyingMetricCoefficient = (metric: BUYING_METRICS) => (metric === BUYING_METRICS.CPM ? 1000 : 1);

const isBuyingMetricValid = (metric: BUYING_METRICS) =>
  metric === BUYING_METRICS.CPV || metric === BUYING_METRICS.CPM || metric === BUYING_METRICS.CPCV;

export const calculateMarginPerChannel = (
  mediaPlan: MediaPlan,
  channel: Partial<Channel>,
  rateCard: RateCard
): { marginPercent: number; marginAbsolute: number } => {
  const { budget, buyingMetric, sellRate } = channel;
  const { buyRate, costsFee = 0 } = rateCard;
  const { tradingDeal = 0, agencyDiscount = 0 } = mediaPlan;

  if (!isBuyingMetricValid(buyingMetric as BUYING_METRICS)) return { marginAbsolute: 0, marginPercent: 0 };
  if (!budget || !buyRate || !sellRate || budget < sellRate) return { marginPercent: 0, marginAbsolute: 0 };

  const expectedUsage = 100;
  const metricCoefficient = getBuyingMetricCoefficient(buyingMetric as BUYING_METRICS);

  const bookedNet = budget - budget * (agencyDiscount / 100);
  const bookedQuantity = (budget / sellRate) * metricCoefficient; //* Impressions */
  const expectedPlatformCosts = (bookedQuantity * buyRate) / metricCoefficient;
  const expectedSkyriseCosts = Math.round(((bookedNet * 100) / expectedUsage) * 0.05);
  const adServingRate = 0;
  const adServingCosts = (adServingRate * bookedQuantity) / 1000;
  const rebate = Math.round(bookedNet * (tradingDeal / 100));
  const marginAbsolute = Math.round(
    bookedNet - expectedPlatformCosts - expectedSkyriseCosts - costsFee - adServingCosts - rebate
  );

  const marginPercent = Math.round((marginAbsolute / bookedNet) * 100);

  return { marginAbsolute, marginPercent };
};

export const calculateMetrics = (channel: Partial<Channel>, rateCard: RateCard): CalculatedMetrics => {
  const { budget = 0, buyingMetric, kpi, sellRate = 0 } = channel;
  const { benchmark = 0 } = rateCard;

  const metrics = { impressions: 0, clicks: 0, views: 0, listens: 0 };

  if (!isBuyingMetricValid(buyingMetric as BUYING_METRICS) || budget < sellRate) return metrics;
  const metricCoefficient = getBuyingMetricCoefficient(buyingMetric as BUYING_METRICS);

  metrics.impressions =
    buyingMetric === BUYING_METRICS.CPM
      ? Math.round((budget / sellRate) * metricCoefficient)
      : Math.round((budget / sellRate / benchmark) * 100);

  const benchmarkMetric = Math.round(metrics.impressions * (benchmark / 100));
  metrics.clicks = benchmarkMetric;
  metrics.listens = kpi?.toLowerCase() === 'ltr' ? benchmarkMetric : 0;
  metrics.views = buyingMetric === BUYING_METRICS.CPM ? benchmarkMetric : Math.round(budget / sellRate);

  return metrics;
};
