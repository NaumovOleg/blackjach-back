import { USER_ROLE } from '@skyrise-eng/types';
import { Router } from 'express';
import { join } from 'path';
import { middleware } from 'express-openapi-validator';
import { authWithRoles, authenticate } from '@src/express-app/middlewares/google-auth';
import {
  getRateCardList,
  createRateCard,
  updateRateCard,
  deleteRateCard,
  getRateCardOptions
} from './controllers';

const apiSpec = join(__dirname, './rate-card-open-api.json');
const checkReadPermission = authWithRoles(
  USER_ROLE.SUPER_ADMIN,
  USER_ROLE.ADMIN,
  USER_ROLE.ACCOUNT_MANAGER,
  USER_ROLE.FINANCE_MANAGER,
  USER_ROLE.TRADER,
  USER_ROLE.LEAD_TRADER
);

const checkWritePermission = authWithRoles(USER_ROLE.SUPER_ADMIN);

const apiRouter = Router()
  .get('/', checkReadPermission, getRateCardList)
  .post('/', checkWritePermission, createRateCard)
  .get('/options', authenticate, getRateCardOptions)
  .delete('/:rateCardId', checkWritePermission, deleteRateCard)
  .put('/:rateCardId', checkWritePermission, updateRateCard);

const router = Router().use(middleware({ apiSpec })).use('/v1', apiRouter);

export { router };
