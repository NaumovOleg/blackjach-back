import { Client } from '@skyrise-eng/types';
import { ClientRepo } from '@domains/interfaces/repositories';
import { ClientSource } from '@data/interfaces/data-sources';
import { Repo } from '@utils';

export class ClientRepository extends Repo<Client> implements ClientRepo {
  protected Source: ClientSource;

  getList() {
    return this.Source.findAll();
  }

  bulkCreateIfNotExists(clients: Omit<Client, '_id'>[]) {
    return this.Source.bulkCreateIfNotExists(clients);
  }

  upsertOne(client: Omit<Client, '_id'>) {
    return this.Source.upsertOne(client);
  }
}
