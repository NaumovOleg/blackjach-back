import { UserListPagination } from '@domains/interfaces/models';
import { GetUserList } from '@domains/interfaces/use-cases';
import { UserRepo } from '@domains/interfaces/repositories';

export class GetUserListUC implements GetUserList {
  constructor(private userRepository: UserRepo) {}

  exec(pagination: UserListPagination) {
    return this.userRepository.getList(pagination);
  }
}
