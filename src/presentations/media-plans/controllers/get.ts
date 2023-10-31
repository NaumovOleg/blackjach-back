import {
  SortMediaPlansList,
  MediaPlanListFilter,
  TypedListRequestQuery,
  MediaPlanFlatten,
  CalculatedMetrics
} from '@skyrise-eng/types';
import { resToJson } from '@utils';
import { UserAuth, MediaPlanListRequest } from '@domains/interfaces/models';
import { getMediaPlanListUseCase, getMediaPlanUseCase } from '@src/domains';

type Query = TypedListRequestQuery<MediaPlanListFilter, SortMediaPlansList>;
type ResBody = { count: number; data: MediaPlanFlatten<string>[] };

export const getMediaPlanList = resToJson<{}, ResBody, null, Query, UserAuth>(({ query }) => {
  const { page, order = -1, limit, sort, search, ...filter } = query;

  const pagination = { page, limit };
  const params: MediaPlanListRequest = { pagination, sort, search, order };

  if (Object.keys(filter).length) params.filter = filter;

  return getMediaPlanListUseCase.exec(params);
});

type MediaPlanResponseBody = MediaPlanFlatten<string> & CalculatedMetrics;

export const getMediaPlan = resToJson<{ planId: string }, MediaPlanResponseBody, null, null, UserAuth>(
  ({ params }) => getMediaPlanUseCase.exec(params.planId)
);
