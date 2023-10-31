import { Model } from 'mongoose';
import { RateCard, BUYING_METRICS } from '@skyrise-eng/types';

export type ModelType = Model<RateCard, {}, {}>;
export const buyingMetricEnums = Object.values(BUYING_METRICS);
