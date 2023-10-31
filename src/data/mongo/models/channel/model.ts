import { Schema, model } from 'mongoose';
import { CHANNEL_MEDIA_PLAN_STATUS } from '@skyrise-eng/types';
import { HandleMongoDBErrors } from '@data/mongo/plugins';
import { Methods, ModelType, statusEnums, buyingMetricEnums, SchemaType } from './types';

const required = function required(this: SchemaType & { get(field: string): any }) {
  const status = this.get('status');
  return status && status !== CHANNEL_MEDIA_PLAN_STATUS.DRAFT;
};

const validateArraysWithStatus = function validateArraysWithStatus(this: SchemaType, value: any) {
  return this.status === CHANNEL_MEDIA_PLAN_STATUS.DRAFT || (Array.isArray(value) && value.length > 0);
};

const schema = new Schema<SchemaType, ModelType, Methods>(
  {
    mediaPlan: { type: Schema.Types.ObjectId, required: true, ref: 'MediaPlan' },
    channel: { type: String, required: true },
    kpi: { type: String, required },
    targetingDetails: { type: String, required },
    product: { type: String, required },
    formats: [String],
    startDate: { type: Date },
    endDate: { type: Date },
    status: {
      required: true,
      type: String,
      enum: statusEnums,
      default: CHANNEL_MEDIA_PLAN_STATUS.READY
    },
    buyingMetric: {
      required,
      type: String,
      enum: buyingMetricEnums
    },
    sellRate: { type: Number, required },
    budget: { type: Number, required },
    poweredBySkyrise: Boolean,
    marginPercent: { type: Number, required: true, default: 0, max: 100 },
    marginAbsolute: { type: Number, required: true, default: 0 },
    impressions: Number,
    views: Number,
    clicks: Number,
    listens: Number
  },
  { timestamps: true }
);

schema.path('formats').validate(validateArraysWithStatus, 'Formats needs to have at least one feature');

schema.index({ status: 1 });
schema.index({ mediaPlan: 1 });
schema.index({ channel: 1 });
schema.index({ mediaPlan: 1, channel: 1, kpi: 1, product: 1, targetingDevice: 1 });

schema.plugin(HandleMongoDBErrors);

export const ChannelModel = model<SchemaType, ModelType>('Channel', schema);
