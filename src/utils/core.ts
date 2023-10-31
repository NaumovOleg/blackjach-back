import { NotFound } from 'http-errors';
import { Model } from 'mongoose';
import { CRUD } from './types';

export abstract class Core<T extends {}, C = Partial<T>, U extends {} = Partial<T>> implements CRUD<T, C, U> {
  protected Model: Model<T, {}, {}>;

  protected ModelName: string;

  async findById(id: string): Promise<T> {
    const result = await this.Model.findById(id).orFail(NotFound(`${this.ModelName} ${id} not found`));
    return result.toJSON({ flattenObjectIds: true });
  }

  async create(data: Omit<C, '_id'>): Promise<T> {
    const user = await new this.Model(data).save();
    return user.toJSON({ flattenObjectIds: true });
  }

  async deleteById(id: string): Promise<T> {
    return this.Model.findByIdAndDelete(id)
      .lean<T>()
      .orFail(NotFound(`${this.ModelName} ${id} not found`));
  }

  async updateById(id: string, data: U): Promise<T> {
    const result = await this.Model.findByIdAndUpdate(id, data, { new: true, runValidators: true }).orFail(
      NotFound(`${this.ModelName} ${id} not found`)
    );

    return result.toJSON({ flattenObjectIds: true });
  }

  async findOne(query: Partial<T>): Promise<T> {
    const result = await this.Model.findOne(query).orFail(NotFound(` not found`));
    return result.toJSON({ flattenObjectIds: true });
  }

  async updateOne(query: Partial<T>, data: Partial<T>): Promise<T> {
    const updated = await this.Model.findOneAndUpdate(
      query,
      { $set: data },
      { new: true, runValidators: true }
    ).orFail(NotFound(` not found`));

    return updated.toJSON({ flattenObjectIds: true });
  }
}
