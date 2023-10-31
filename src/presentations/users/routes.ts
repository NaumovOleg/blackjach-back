import { USER_ROLE } from '@skyrise-eng/types';
import { Router } from 'express';
import { join } from 'path';
import { middleware } from 'express-openapi-validator';
import { authenticate, authWithRoles } from '@src/express-app/middlewares/google-auth';
import { getUser, getUserList, createUser, updateUser, deleteUser } from './controllers';

const apiSpec = join(__dirname, './user-open-api.json');

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
  .get('/', authenticate, getUser)
  .get('/list', checkReadPermission, getUserList)
  .post('/', checkWritePermission, createUser)
  .put('/:userId', checkWritePermission, updateUser)
  .delete('/:userId', checkWritePermission, deleteUser);

const router = Router().use(middleware({ apiSpec })).use('/v1', apiRouter);

export { router };
