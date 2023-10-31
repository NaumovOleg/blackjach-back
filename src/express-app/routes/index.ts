import { IRouter, Application } from 'express';
import { IMount } from '@express-app/types';

class Routes implements IMount {
  constructor(private router: IRouter, private prefix: string = '/') {}

  public mount(app: Application): Application {
    return app.use(this.prefix, this.router);
  }
}

export { Routes };
