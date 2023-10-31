import serverlessExpress from '@vendia/serverless-express';
import { Express } from '@express-app/express';
import { Bootstrap } from '@express-app/middlewares';
import { Providers } from '@express-app/providers';
import { Handler } from '@express-app/error-handlers';
import { Routes } from '@express-app/routes';

export const makeHandler = (routes: Routes): ReturnType<typeof serverlessExpress> => {
  const { app } = new Express(routes, Bootstrap, Providers, Handler);

  return serverlessExpress({ app });
};
