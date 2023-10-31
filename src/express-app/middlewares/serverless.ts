import { Application } from 'express';
import { getCurrentInvoke } from '@vendia/serverless-express';

class Serverless {
  public static mount(app: Application): Application {
    app.use((_, __, next) => {
      const { context } = getCurrentInvoke();
      context && (context.callbackWaitsForEmptyEventLoop = false);
      return next();
    });
    return app;
  }
}

export default Serverless;
