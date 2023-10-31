import { User } from '@skyrise-eng/types';
import { UpdateUser } from '@domains/interfaces/use-cases';
import { UserRepo } from '@domains/interfaces/repositories';

export class UpdateUserUC implements UpdateUser {
  constructor(private userRepository: UserRepo) {}

  exec(id: string, data: Partial<Omit<User, '_id'>>) {
    return this.userRepository.updateById(id, data);
  }
}
