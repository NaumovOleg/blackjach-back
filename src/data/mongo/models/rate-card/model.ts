import { Schema, model } from 'mongoose';
import { RateCard } from '@skyrise-eng/types';
import { ModelType, buyingMetricEnums } from './types';

const schema = new Schema<RateCard, ModelType, {}>(
  {
    channel: { type: String, required: true },
    product: String,
    buyingMetric: {
      type: String,
      enum: buyingMetricEnums
    },
    kpis: [{ type: String }],
    formats: [String],
    tactic: String,
    monthlySpent: Number,
    benchmark: Number,
    cost: { type: Boolean, default: false },
    costsFee: Number,
    notes: String,
    sellRate: { type: Number, default: 0 },
    buyRate: { type: Number, default: 0 },
    isDraft: { type: Boolean, default: true }
  },
  { timestamps: true }
);

schema.index({ channel: 1 });
schema.index({ channel: 1, product: 1, kpis: 1, isDraft: 1 });

export const RateCardModel = model<RateCard, ModelType>('RateCard', schema);
