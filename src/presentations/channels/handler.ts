import 'source-map-support/register';
import { Routes } from '@express-app/routes';
import { makeHandler } from '@src/presentations/handler';
import { router } from './routes';

export const handler = makeHandler(new Routes(router, '/api'));
