import { User } from '@skyrise-eng/types';
import { resToJson, trimStartEnd } from '@utils';
import { UserAuth } from '@domains/interfaces/models';
import { updateUserUseCase } from '@src/domains';

export const updateUser = resToJson<{ userId: string }, User, Partial<Omit<User, '_id'>>, any, UserAuth>(
  ({ body, params }) => updateUserUseCase.exec(params.userId, trimStartEnd(body, 'firstName'))
);
