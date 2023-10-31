import { Model } from 'mongoose';
import { User, USER_ROLE } from '@skyrise-eng/types';

export interface SchemaType extends User {}
export type ModelType = Model<User, {}, {}>;
export const roleEnums = Object.values(USER_ROLE);
