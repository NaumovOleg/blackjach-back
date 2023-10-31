import { ConnectionRepo } from '@domains/interfaces/repositories';
import { ConnectionWrapper } from '@data/interfaces/wrappers';

export class ConnectionRepository implements ConnectionRepo {
  constructor(private connection: ConnectionWrapper) {}

  openConnection() {
    return this.connection.open();
  }

  closeConnection() {
    return this.connection.close();
  }
}
