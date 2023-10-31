import express, { Application } from 'express';
import { IMount } from '@express-app/types';

export class Express {
  public app: Application;

  constructor(
    private routes: IMount,
    private bootstrap: IMount,
    private providers: IMount,
    private errorHandler: IMount
  ) {
    this.app = express();
    this.bootstrap.mount(this.app);
    this.providers.mount(this.app);
    this.routes.mount(this.app);
    this.errorHandler.mount(this.app);
  }

  public listen(port: number): void {
    this.app
      // eslint-disable-next-line no-console
      .listen(port, () => console.debug(`Listening http://localhost:${port}`))
      // eslint-disable-next-line no-console
      .on('error', (err) => console.error('Error: ', err.message));
  }
}
