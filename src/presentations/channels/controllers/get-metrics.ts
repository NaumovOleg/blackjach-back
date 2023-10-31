import { MetricsQuery, MetricsResponse } from '@skyrise-eng/types';
import { resToJson } from '@utils';
import { UserAuth } from '@domains/interfaces/models';
import { calculateMetricsUseCase } from '@src/domains';

export const getChannelMetrics = resToJson<{}, MetricsResponse, null, MetricsQuery, UserAuth>(({ query }) =>
  calculateMetricsUseCase.exec(query.mediaPlan, {
    ...query,
    budget: +(query.budget ?? 0),
    sellRate: +(query.sellRate ?? 0)
  })
);
