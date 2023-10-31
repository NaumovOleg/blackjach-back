import { Model, Types } from 'mongoose';
import { Channel, CHANNEL_MEDIA_PLAN_STATUS, BUYING_METRICS } from '@skyrise-eng/types';

export interface SchemaType extends Omit<Channel, 'mediaPlan' | 'publishers'> {
  mediaPlan: Types.ObjectId;
  publishers: Types.ObjectId[];
}

export interface Methods {
  setAsDraft(): void;
}

export type ModelType = Model<Channel, {}, Methods>;
export const statusEnums = Object.values(CHANNEL_MEDIA_PLAN_STATUS);
export const buyingMetricEnums = Object.values(BUYING_METRICS);
