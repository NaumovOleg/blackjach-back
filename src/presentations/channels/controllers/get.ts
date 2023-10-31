import { ChannelListFilter, Channel, SortChannelList, TypedListRequestQuery } from '@skyrise-eng/types';
import { resToJson } from '@utils';
import { UserAuth, ChannelListRequest } from '@domains/interfaces/models';
import { getChannelListUseCase } from '@src/domains';

type Query = TypedListRequestQuery<ChannelListFilter, SortChannelList>;

type ResBody = { count: number; data: Channel[] };

export const getChannelsList = resToJson<{}, ResBody, null, Query, UserAuth>(({ query }) => {
  const { page, order = -1, limit, sort, search, ...filter } = query;

  const pagination = { page, limit };
  const params: ChannelListRequest = { pagination, sort, search, order, filter };

  return getChannelListUseCase.exec(params);
});
