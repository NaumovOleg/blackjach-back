import { NotFound } from 'http-errors';
import { Model } from 'mongoose';
import { CRUD } from '@utils';

export abstract class Core<T extends {}, C = Partial<T>, U extends {} = Partial<T>> implements CRUD<T, C, U> {
  protected Model: Model<T, {}, {}>;

  protected ModelName: string;

  findById(id: string): Promise<T> {
    return this.Model.findById(id).orFail(NotFound(`${this.ModelName} ${id} not found`));
  }

  async create(data: C): Promise<T> {
    const user = await new this.Model(data).save();
    return user.toJSON({ flattenObjectIds: true });
  }

  async deleteById(id: string): Promise<T> {
    const deleted = await this.Model.findByIdAndDelete(id).lean<T>();
    if (!deleted) throw new NotFound(`${this.ModelName} ${id} not found`);
    return deleted;
  }

  async updateById(id: string, data: Partial<U>): Promise<T> {
    return this.Model.findByIdAndUpdate(id, data, { new: true, runValidators: true }).orFail(
      NotFound(`${this.ModelName} ${id} not found`)
    );
  }
}
