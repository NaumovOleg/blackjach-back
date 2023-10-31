import { User } from '@skyrise-eng/types';
import { resToJson } from '@utils';
import { UserAuth } from '@domains/interfaces/models';
import { deleteUserUseCase } from '@src/domains';

export const deleteUser = resToJson<{ userId: string }, User, any, any, UserAuth>(({ params }) =>
  deleteUserUseCase.exec(params.userId)
);
