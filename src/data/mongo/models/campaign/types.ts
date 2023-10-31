import { Types, Model } from 'mongoose';
import { Campaign } from '@skyrise-eng/types';

export interface SchemaType extends Omit<Campaign, 'client'> {
  client: Types.ObjectId;
}
export type ModelType = Model<Campaign, {}, {}>;
