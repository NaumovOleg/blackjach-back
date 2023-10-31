import { Application } from 'express';

import Http from './http';
import Cors from './cors';
import Serverless from './serverless';

class Bootstrap {
  public static mount(app: Application): Application {
    Serverless.mount(app);
    Http.mount(app);
    Cors.mount(app);

    return app;
  }
}

export { Bootstrap };
