import { User } from '@skyrise-eng/types';
import { CreateUser } from '@domains/interfaces/use-cases';
import { UserRepo } from '@domains/interfaces/repositories';

export class CreateUserUC implements CreateUser {
  constructor(private userRepository: UserRepo) {}

  exec(user: Omit<User, '_id'>) {
    return this.userRepository.create(user);
  }
}
