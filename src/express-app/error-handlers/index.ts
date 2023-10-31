import { Application } from 'express';

import NotFound from './express-error';
import ExpressError from './not-found';

class Handler {
  public static mount(app: Application): Application {
    ExpressError.mount(app);
    NotFound.mount(app);

    return app;
  }
}

export { Handler };
