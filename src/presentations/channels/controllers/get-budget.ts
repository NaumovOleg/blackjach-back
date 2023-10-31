import { resToJson } from '@utils';
import { UserAuth } from '@domains/interfaces/models';
import { getChannelsBudgetUseCase } from '@src/domains';

type Query = { mediaPlan: string; excludeChannel: string };

export const getChannelsBudget = resToJson<{}, number, null, Query, UserAuth>(({ query }) =>
  getChannelsBudgetUseCase.exec(query.mediaPlan, query.excludeChannel)
);
