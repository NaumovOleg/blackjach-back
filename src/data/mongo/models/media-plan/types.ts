import { Types, Model } from 'mongoose';
import { MediaPlan, CHANNEL_MEDIA_PLAN_STATUS } from '@skyrise-eng/types';

export interface SchemaType extends Omit<MediaPlan, 'client' | 'manager' | 'campaign'> {
  client: Types.ObjectId;
  manager: Types.ObjectId;
  campaign: Types.ObjectId;
}
export type ModelType = Model<MediaPlan, {}, {}>;
export const statusEnums = Object.values(CHANNEL_MEDIA_PLAN_STATUS);
