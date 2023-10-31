import { DeleteUser } from '@domains/interfaces/use-cases';
import { UserRepo } from '@domains/interfaces/repositories';

export class DeleteUserUC implements DeleteUser {
  constructor(private userRepository: UserRepo) {}

  exec(id: string) {
    return this.userRepository.deleteById(id);
  }
}
