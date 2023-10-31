import { Channel } from '@skyrise-eng/types';
import { resToJson } from '@utils';
import { UserAuth } from '@domains/interfaces/models';
import { deleteChannelUseCase, refreshMediaPlanUseCase } from '@src/domains';

export const deleteChannel = resToJson<{ channelId: string }, Channel, null, null, UserAuth>(
  async ({ params }) => {
    const deleted = await deleteChannelUseCase.exec(params.channelId);
    await refreshMediaPlanUseCase.exec(deleted.mediaPlan);
    return deleted;
  }
);
