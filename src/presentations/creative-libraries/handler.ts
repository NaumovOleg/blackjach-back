import 'source-map-support/register';

import serverlessExpress from '@vendia/serverless-express';
import { Express } from '@express-app/express';
import { Bootstrap } from '@express-app/middlewares';
import { Providers } from '@express-app/providers';
import { Handler } from '@express-app/error-handlers';
import { Routes } from '@express-app/routes';

import { router } from './routes';

const lambdaRouter = new Routes(router, '/api');

const { app } = new Express(lambdaRouter, Bootstrap, Providers, Handler);

export const handler = serverlessExpress({ app });
