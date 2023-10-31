import { Client } from '@skyrise-eng/types';
import { ClientSource } from '@data/interfaces/data-sources';
import { ClientCoreWrapper } from '@data/interfaces/wrappers';
import { Source } from '@utils';

export class ClientDataSource extends Source<Client> implements ClientSource {
  protected Core: ClientCoreWrapper;

  findAll() {
    return this.Core.findAll();
  }

  bulkCreateIfNotExists(clients: Omit<Client, '_id'>[]) {
    return this.Core.bulkCreateIfNotExists(clients);
  }

  upsertOne(client: Omit<Client, '_id'>) {
    return this.Core.upsertOne(client);
  }
}
