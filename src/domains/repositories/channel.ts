import { CreateChannelRequest, Channel, CHANNEL_MEDIA_PLAN_STATUS } from '@skyrise-eng/types';
import { ChannelRepo } from '@domains/interfaces/repositories';
import { ChannelSource } from '@data/interfaces/data-sources';
import { ChannelListRequest, UpdateChannelBody } from '@domains/interfaces/models';
import { Repo } from '@utils';

export class ChannelRepository
  extends Repo<Channel, CreateChannelRequest, UpdateChannelBody>
  implements ChannelRepo
{
  protected Source: ChannelSource;

  getList(params: ChannelListRequest) {
    return this.Source.getList(params);
  }

  delete(params: string | string[]): Promise<any> {
    return Array.isArray(params) ? this.Source.deleteByMediaIds(params) : this.Source.deleteById(params);
  }

  async getChannelsTotalBudget(mediaPlan: string, excludeChannel?: string) {
    const channels = await this.Source.getManyByMediaId(mediaPlan).then((resp) =>
      resp.filter((ch) => ch._id !== excludeChannel)
    );

    return channels.reduce((acc, curr) => acc + (curr.budget ?? 0), 0);
  }

  createAndCheckDraft(channel: CreateChannelRequest): Promise<Channel> {
    if (channel.saveAsDraft) {
      channel.status = CHANNEL_MEDIA_PLAN_STATUS.DRAFT;
    }
    return this.Source.create(channel);
  }

  edit(id: string, channel: UpdateChannelBody) {
    return this.Source.edit(id, channel);
  }

  getManyByMediaId(mediaId: string) {
    return this.Source.getManyByMediaId(mediaId);
  }

  getMetricsByMediaPlanId(mediaPlanId: string) {
    return this.Source.getMetricsByMediaPlanId(mediaPlanId);
  }
}
