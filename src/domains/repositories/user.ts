import { User } from '@skyrise-eng/types';
import { UserRepo } from '@domains/interfaces/repositories';
import { UserSource } from '@data/interfaces/data-sources';
import { UserListPagination } from '@domains/interfaces/models';
import { Repo } from '@utils';

export class UseRepository extends Repo<User> implements UserRepo {
  protected Source: UserSource;

  findByEmail(email: string) {
    return this.Source.findByEmail(email);
  }

  getList(pagination: UserListPagination) {
    return this.Source.getList(pagination);
  }
}
