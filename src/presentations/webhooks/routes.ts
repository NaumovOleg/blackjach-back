import { Router } from 'express';
import { authenticatePipedriveWebhook } from '@express-app/middlewares/pipedrive-webhook-auth';

import { observeDeal } from './controllers';

const router = Router().post('/deals', authenticatePipedriveWebhook, observeDeal);

export { router };
