import { User } from '@skyrise-eng/types';
import { resToJson } from '@utils';
import { UserAuth, UserListPagination } from '@domains/interfaces/models';
import { getUserUseCase, getUserListUseCase } from '@src/domains';

type ListResponse = { count: number; data: User[] };

export const getUser = resToJson<{}, User | null, any, any, UserAuth>((_, { locals }) =>
  getUserUseCase.exec(locals.user.email)
);

export const getUserList = resToJson<{}, ListResponse, any, UserListPagination, UserAuth>(({ query }) =>
  getUserListUseCase.exec(query)
);
