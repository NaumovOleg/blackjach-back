import { Router } from 'express';
import { join } from 'path';
import { USER_ROLE } from '@skyrise-eng/types';
import { middleware } from 'express-openapi-validator';
import { authWithRoles, authenticate } from '@src/express-app/middlewares/google-auth';
import {
  getChannelsList,
  createChannel,
  deleteChannel,
  getChannelsBudget,
  editChannel,
  getChannelMetrics
} from './controllers';

const apiSpec = join(__dirname, './channel-open-api.json');

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
  .get('/', checkReadPermission, getChannelsList)
  .get('/budget', authenticate, getChannelsBudget)
  .get('/metrics', authenticate, getChannelMetrics)
  .post('/', checkWritePermission, createChannel)
  .delete('/:channelId', checkWritePermission, deleteChannel)
  .put('/:channelId', checkWritePermission, editChannel);

const router = Router().use(middleware({ apiSpec })).use('/v1', apiRouter);

export { router };
