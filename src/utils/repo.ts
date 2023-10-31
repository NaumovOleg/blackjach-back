import { CRUD } from './types';

export abstract class Repo<T, C = Partial<T>, U = Partial<T>> {
  constructor(protected Source: CRUD<T, C, U>) {}

  findById(id: string): Promise<T> {
    return this.Source.findById(id);
  }

  create(data: Omit<C, '_id'>): Promise<T> {
    return this.Source.create(data);
  }

  deleteById(id: string): Promise<T> {
    return this.Source.deleteById(id);
  }

  updateById(id: string, data: U): Promise<T> {
    return this.Source.updateById(id, data);
  }

  findOne(query: Partial<T>): Promise<T> {
    return this.Source.findOne(query);
  }

  updateOne(query: Partial<T>, data: Partial<T>): Promise<T> {
    return this.Source.updateOne(query, data);
  }
}
