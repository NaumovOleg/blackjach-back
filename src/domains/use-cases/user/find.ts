import { isValidObjectId } from 'mongoose';
import { FindUser } from '@domains/interfaces/use-cases';
import { UserRepo } from '@domains/interfaces/repositories';

export class FindUserUC implements FindUser {
  constructor(private userRepository: UserRepo) {}

  exec(search: string) {
    return isValidObjectId(search)
      ? this.userRepository.findById(search)
      : this.userRepository.findByEmail(search);
  }
}
