import { User } from '@skyrise-eng/types';
import { UserSource } from '@data/interfaces/data-sources';
import { UserCoreWrapper } from '@data/interfaces/wrappers';
import { UserListPagination } from '@domains/interfaces/models';
import { Source } from '@utils';

export class UserDataSource extends Source<User> implements UserSource {
  protected Core: UserCoreWrapper;

  findByEmail(email: string) {
    return this.Core.findByEmail(email);
  }

  getList(pagination: UserListPagination) {
    return this.Core.findAll(pagination);
  }
}
