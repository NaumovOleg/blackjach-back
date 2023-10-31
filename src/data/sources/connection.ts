import { ConnectionWrapper } from '@data/interfaces/wrappers';

export class DbConnectionSource implements ConnectionWrapper {
  constructor(private connection: ConnectionWrapper) {}

  open() {
    return this.connection.open();
  }

  close() {
    return this.connection.open();
  }
}
