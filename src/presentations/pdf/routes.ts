import { Router } from 'express';
import { middleware } from 'express-openapi-validator';
import { join } from 'path';
import { authenticate } from '@src/express-app/middlewares/google-auth';
import { getCampaignPdf } from './controllers';

const apiSpec = join(__dirname, './pdf-open-api.json');
const apiRouter = Router().get('/campaign-schedule/:mediaPlan', authenticate, getCampaignPdf);

const router = Router().use(middleware({ apiSpec })).use('/v1', apiRouter);

export { router };
