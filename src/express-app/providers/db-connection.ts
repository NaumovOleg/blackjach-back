import { DbConnectionSource } from '@data/sources';
import { ConnectionRepository } from '@domains/repositories/db-connection';
import { CloseDbConnectionUC } from '@domains/use-cases/db-connections';
import { Connection } from '@data/mongo/connection';

const dbConnectionSource = new DbConnectionSource(new Connection());
const connectionRepository = new ConnectionRepository(dbConnectionSource);
const openConnection = new CloseDbConnectionUC(connectionRepository);

class ConnectDb {
  public static mount(): Promise<any> {
    return openConnection.exec();
  }
}

export { ConnectDb };
