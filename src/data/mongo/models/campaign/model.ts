import { Schema, model } from 'mongoose';
import { HandleMongoDBErrors } from '@data/mongo/plugins';
import { SchemaType, ModelType } from './types';

const schema = new Schema<SchemaType, ModelType, {}>(
  {
    name: { type: String, required: true },
    client: { type: Schema.Types.ObjectId, required: false, ref: 'Client' },
    campaignId: { type: Number, required: true },
    totalBudget: { type: Number, min: 0, required: true },
    advertiser: {
      name: String,
      address: String,
      email: String,
      ownerId: String,
      value: String
    }
  },
  { timestamps: true }
);

schema.index({ client: 1 });
schema.index({ name: 1 });
schema.index({ campaignId: 1 });
schema.index({ name: 1, totalBudget: 1 });
schema.index({ name: 1, client: 1, totalBudget: 1 });
schema.plugin(HandleMongoDBErrors);

export const CampaignModel = model<SchemaType, ModelType>('Campaign', schema);
