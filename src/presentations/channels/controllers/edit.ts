import { Channel } from '@skyrise-eng/types';
import { resToJson } from '@utils';
import { UserAuth, UpdateChannelBody } from '@domains/interfaces/models';
import { updateChannelUseCase, refreshMediaPlanUseCase, calculateMetricsUseCase } from '@src/domains';

export const editChannel = resToJson<{ channelId: string }, Channel, UpdateChannelBody, null, UserAuth>(
  async ({ params, body }) => {
    const updated = await updateChannelUseCase.exec(params.channelId, body);
    if (!body.budget && !body.buyingMetric) {
      return updated;
    }
    const metrics = await calculateMetricsUseCase.exec(updated.mediaPlan, updated);
    const refreshedMargin = await updateChannelUseCase.exec(params.channelId, metrics);
    await refreshMediaPlanUseCase.exec(updated.mediaPlan);
    return refreshedMargin;
  }
);
