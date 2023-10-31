import { Client } from '@skyrise-eng/types';
import { ClientCoreWrapper } from '@src/data/interfaces/wrappers';
import { Core } from '@utils';
import { ClientModel } from './model';

export class ClientCore extends Core<Client> implements ClientCoreWrapper {
  protected Model = ClientModel;

  protected ModelName = 'Client';

  findAll(): Promise<Client[]> {
    return this.Model.find().sort({ name: 1 }).lean();
  }

  upsertOne(client: Omit<Client, '_id'>) {
    return this.Model.findOneAndUpdate(client, client, { upsert: true, new: true }).lean();
  }

  async bulkCreateIfNotExists(clients: Omit<Client, '_id'>[]) {
    const queries = clients.map(({ name }) =>
      this.Model.findOneAndUpdate({ name }, { name }, { upsert: true, new: true }).lean()
    );

    return Promise.all(queries);
  }
}
