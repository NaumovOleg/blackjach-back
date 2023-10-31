import { USER_ROLE } from '@skyrise-eng/types';
import { Router } from 'express';
import { join } from 'path';
import { middleware } from 'express-openapi-validator';
import { authWithRoles } from '@src/express-app/middlewares/google-auth';
import {
  getMediaPlanList,
  createMediaPlan,
  deleteMediaPlan,
  getMediaPlan,
  updateMediaPlan
} from './controllers';

const apiSpec = join(__dirname, './media-plan-open-api.json');

const checkReadPermission = authWithRoles(
  USER_ROLE.SUPER_ADMIN,
  USER_ROLE.ADMIN,
  USER_ROLE.ACCOUNT_MANAGER,
  USER_ROLE.FINANCE_MANAGER,
  USER_ROLE.TRADER,
  USER_ROLE.LEAD_TRADER
);

const checkWritePermission = authWithRoles(
  USER_ROLE.SUPER_ADMIN,
  USER_ROLE.ADMIN,
  USER_ROLE.ACCOUNT_MANAGER,
  USER_ROLE.FINANCE_MANAGER
);

const apiRouter = Router()
  .get('/', checkReadPermission, getMediaPlanList)
  .get('/:planId', checkReadPermission, getMediaPlan)
  .post('/', checkWritePermission, createMediaPlan)
  .delete('/:planId', checkWritePermission, deleteMediaPlan)
  .put('/:planId', checkWritePermission, updateMediaPlan);

const router = Router().use(middleware({ apiSpec })).use('/v1', apiRouter);

export { router };
