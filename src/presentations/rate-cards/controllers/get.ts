import { RateCard, TypedListRequestQuery } from '@skyrise-eng/types';
import { resToJson } from '@utils';
import { UserAuth, RateCardListRequest } from '@domains/interfaces/models';
import { getRateCardListUseCase } from '@src/domains';

type ResBody = { count: number; data: RateCard[] };
type Query = TypedListRequestQuery<{ channel?: string[] }, 'channel'>;
export const getRateCardList = resToJson<{}, ResBody, any, Query, UserAuth>(({ query }) => {
  const { page, limit, order = 1, sort, channel } = query;

  const params: RateCardListRequest = { sort, order, pagination: { page, limit } };
  if (channel?.length) params.filter = { channel };

  return getRateCardListUseCase.exec(params);
});
