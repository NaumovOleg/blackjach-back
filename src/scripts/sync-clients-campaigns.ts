import env from 'dotenv';
import { syncClientsAndCampaignsUseCase } from '@src/domains';
import { DbConnectionSource } from '@data/sources';
import { ConnectionRepository } from '@domains/repositories/db-connection';
import { CloseDbConnectionUC } from '@domains/use-cases/db-connections';
import { Connection } from '@data/mongo/connection';

env.config();
const dbConnectionSource = new DbConnectionSource(new Connection());
const connectionRepository = new ConnectionRepository(dbConnectionSource);
const openConnection = new CloseDbConnectionUC(connectionRepository);

(async () => {
  await openConnection.exec();
  await syncClientsAndCampaignsUseCase.exec();
})();
