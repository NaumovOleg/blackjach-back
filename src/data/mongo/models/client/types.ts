import { Model } from 'mongoose';
import { Client } from '@skyrise-eng/types';

export interface SchemaType extends Client {}
export type ModelType = Model<Client, {}, {}>;
