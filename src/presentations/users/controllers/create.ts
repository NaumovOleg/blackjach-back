import { User } from '@skyrise-eng/types';
import { resToJson, trimStartEnd } from '@utils';
import { UserAuth } from '@domains/interfaces/models';
import { createUserUseCase } from '@src/domains';

export const createUser = resToJson<{}, User, Omit<User, '_id'>, any, UserAuth>(({ body }) =>
  createUserUseCase.exec(trimStartEnd(body, 'firstName'))
);
