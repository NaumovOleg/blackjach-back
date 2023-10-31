import { Pagination, Filter } from '@skyrise-eng/types';

export type TypedListRequest<F extends Filter, S extends string> = {
  order: 1 | -1;
  pagination: Pagination;
  filter?: F;
  search?: string;
  sort?: S;
};

export interface CRUD<T, C = Partial<T>, U = Partial<T>> {
  findById(id: string): Promise<T>;
  create(data: Omit<C, '_id'>): Promise<T>;
  deleteById(id: string): Promise<T>;
  updateById(id: string, data: U): Promise<T>;
  findOne(query: Partial<T>): Promise<T>;
  updateOne(query: Partial<T>, data: Partial<T>): Promise<T>;
}
