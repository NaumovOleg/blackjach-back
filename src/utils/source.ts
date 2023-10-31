import { CRUD } from './types';

export abstract class Source<T, C = Partial<T>, U = Partial<T>> {
  constructor(protected Core: CRUD<T, C, U>) {}

  findById(id: string): Promise<T> {
    return this.Core.findById(id);
  }

  create(data: Omit<C, '_id'>): Promise<T> {
    return this.Core.create(data);
  }

  deleteById(id: string): Promise<T> {
    return this.Core.deleteById(id);
  }

  async updateById(id: string, data: U): Promise<T> {
    return this.Core.updateById(id, data);
  }

  findOne(query: Partial<T>): Promise<T> {
    return this.Core.findOne(query);
  }

  updateOne(query: Partial<T>, data: Partial<T>): Promise<T> {
    return this.Core.updateOne(query, data);
  }
}
