import mongoose, { Mongoose } from 'mongoose';
import { config } from 'node-config-ts';
import { ConnectionWrapper } from '@data/interfaces/wrappers';

export class Connection implements ConnectionWrapper {
  private mongoose: Mongoose;

  constructor(private settings: typeof config.DATABASE = config.DATABASE) {
    this.mongoose = mongoose;
  }

  async open(): Promise<Mongoose> {
    if (this.mongoose.connection.readyState === 1) {
      return this.mongoose;
    }

    const { url, ...options } = this.settings;
    // eslint-disable-next-line no-console
    console.info('============> OPEN CONNECTION');
    return mongoose.connect(url, options);
  }

  async close(): Promise<void> {
    // eslint-disable-next-line no-console
    console.info('============> CONNECTION CLOSED');
    await this.mongoose.connection.close();
  }
}
