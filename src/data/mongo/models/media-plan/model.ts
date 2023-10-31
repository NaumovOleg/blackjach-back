import { Schema, model } from 'mongoose';
import { MediaPlan, CHANNEL_MEDIA_PLAN_STATUS } from '@skyrise-eng/types';
import moment from 'moment';
import { HandleMongoDBErrors } from '@data/mongo/plugins';
import { SchemaType, ModelType, statusEnums } from './types';

const schema = new Schema<SchemaType, ModelType, {}>(
  {
    campaign: { type: Schema.Types.ObjectId, required: true, ref: 'Campaign', unique: true },
    client: { type: Schema.Types.ObjectId, required: true, ref: 'Client' },
    manager: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    startDate: {
      type: Date,
      validate: {
        validator(this: MediaPlan & { get(field: string): any }, startDate: Date) {
          return moment(startDate).isBefore(moment(this.get('endDate')));
        },
        message: ({ path }) => `invalid ${path} path`
      }
    },
    endDate: Date,
    scheduleDate: Date,
    status: {
      required: true,
      type: String,
      enum: statusEnums,
      default: CHANNEL_MEDIA_PLAN_STATUS.DRAFT
    },
    totalBudget: { type: Number },
    tradingDeal: { type: Number, min: 0, default: 0, max: 100 },
    marginPercent: { type: Number, required: true, default: 0, max: 100 },
    agencyDiscount: { type: Number, required: true, default: 0, max: 100 }
  },
  { timestamps: true }
);

schema.index({ client: 1 });
schema.index({ manager: 1 });
schema.index({ status: 1 });
schema.index({ campaign: 1 });
schema.index({ client: 1, channel: 1, campaign: 1, manager: 1 });
schema.plugin(HandleMongoDBErrors);

export const MediaPlanModel = model<SchemaType, ModelType>('MediaPlan', schema);
