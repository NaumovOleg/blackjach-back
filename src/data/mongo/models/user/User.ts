import { Schema, model } from 'mongoose';
import { HandleMongoDBErrors } from '@data/mongo/plugins';
import { ModelType, SchemaType, roleEnums } from './types';

const schema = new Schema<SchemaType, ModelType, {}>(
  {
    email: {
      type: String,
      required: true,
      index: true,
      unique: true,
      immutable: true,
      validate: /^[a-zA-Z0-9._%+-]+@skyri\.se$/
    },
    firstName: {
      type: String,
      required: true,
      validate: {
        validator: (val: string) => !!val.trim(),
        message: `First name can't be empty`
      }
    },
    lastName: String,
    role: {
      type: String,
      enum: roleEnums
    }
  },
  { timestamps: true }
);
schema.index({ email: 1 });
schema.plugin(HandleMongoDBErrors);

export const UserModel = model<SchemaType, ModelType>('User', schema);
