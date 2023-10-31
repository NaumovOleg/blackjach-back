import { Router } from 'express';
import { join } from 'path';
import { middleware } from 'express-openapi-validator';
import { authenticate } from '@src/express-app/middlewares/google-auth';
import { getClientList } from './controllers';

const apiSpec = join(__dirname, './client-open-api.json');

const apiRouter = Router().get('/', authenticate, getClientList);
const router = Router().use(middleware({ apiSpec })).use('/v1', apiRouter);

export { router };
