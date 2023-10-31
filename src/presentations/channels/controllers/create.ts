import { Channel, CreateChannelRequest } from '@skyrise-eng/types';
import { resToJson } from '@utils';
import { UserAuth } from '@domains/interfaces/models';
import { createChannelUseCase, refreshMediaPlanUseCase, calculateMetricsUseCase } from '@src/domains';

export const createChannel = resToJson<{}, Channel, CreateChannelRequest, null, UserAuth>(
  async ({ body }) => {
    const metrics = await calculateMetricsUseCase.exec(body.mediaPlan, body);
    const response = await createChannelUseCase.exec({ ...body, ...metrics });
    await refreshMediaPlanUseCase.exec(body.mediaPlan);
    return response;
  }
);
