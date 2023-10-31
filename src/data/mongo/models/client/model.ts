import { Schema, model } from 'mongoose';
import { HandleMongoDBErrors } from '@data/mongo/plugins';
import { SchemaType, ModelType } from './types';

const schema = new Schema<SchemaType, ModelType>(
  { name: { type: String, unique: true } },
  { timestamps: true }
);

schema.index({ name: 1 });
schema.plugin(HandleMongoDBErrors);

export const ClientModel = model<SchemaType, ModelType>('Client', schema);
