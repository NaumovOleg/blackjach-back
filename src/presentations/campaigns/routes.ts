import { Router } from 'express';
import { join } from 'path';
import { middleware } from 'express-openapi-validator';
import { authenticate } from '@src/express-app/middlewares/google-auth';
import { getCampaignList } from './controllers';

const apiSpec = join(__dirname, './campaign-open-api.json');

const apiRouter = Router().get('/', authenticate, getCampaignList);
const router = Router().use(middleware({ apiSpec })).use('/v1', apiRouter);

export { router };
