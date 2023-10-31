import { Connection } from '@domains/interfaces/use-cases';
import { ConnectionRepo } from '@domains/interfaces/repositories';

export class CloseDbConnectionUC implements Connection {
  constructor(private connectionRepository: ConnectionRepo) {}

  exec() {
    return this.connectionRepository.openConnection();
  }
}
