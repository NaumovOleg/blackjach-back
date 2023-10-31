import { CreateChannelRequest, Channel } from '@skyrise-eng/types';
import { ChannelListRequest, UpdateChannelBody } from '@domains/interfaces/models';
import { ChannelSource } from '@data/interfaces/data-sources';
import { ChannelCoreWrapper } from '@data/interfaces/wrappers';
import { Source } from '@utils';

export class ChannelDataSource
  extends Source<Channel, CreateChannelRequest, UpdateChannelBody>
  implements ChannelSource
{
  protected Core: ChannelCoreWrapper;

  getList(params: ChannelListRequest) {
    return this.Core.getList(params);
  }

  deleteByMediaIds(mediaIds: string[]) {
    return this.Core.deleteByMediaIds(mediaIds);
  }

  getManyByMediaId(mediaPlan: string) {
    return this.Core.getManyByMediaId(mediaPlan);
  }

  edit(id: string, channel: UpdateChannelBody) {
    return this.Core.edit(id, channel);
  }

  getMetricsByMediaPlanId(mediaPlanId: string) {
    return this.Core.getMetricsByMediaPlanId(mediaPlanId);
  }
}
