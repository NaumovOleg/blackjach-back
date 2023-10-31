import { Channel } from '@skyrise-eng/types';
import { Types } from 'mongoose';
import { NotFound } from 'http-errors';
import { ChannelListRequest, UpdateChannelBody } from '@domains/interfaces/models';
import { ChannelCoreWrapper } from '@src/data/interfaces/wrappers';
import { getSkipLimit, Core } from '@src/utils';
import { ChannelModel } from './model';
import { getFilterQuery, formUpdateChannelQuery } from '../helper';

export class ChannelCore extends Core<Channel> implements ChannelCoreWrapper {
  protected Model = ChannelModel;

  protected ModelName = 'Channel';

  async deleteByMediaIds(mediaIds: string[]) {
    return this.Model.deleteMany({ mediaPlan: { $in: mediaIds } });
  }

  async getList(params: ChannelListRequest) {
    const options = getFilterQuery(params.filter);

    const { skip, limit } = getSkipLimit(params.pagination);

    const query = this.Model.find(options);
    const data = query
      .clone()
      .skip(skip)
      .limit(limit)
      .sort({ [params.sort ?? '_id']: params.order })
      .lean<Channel[]>();

    return {
      data: await data,
      count: await query.countDocuments()
    };
  }

  async getManyByMediaId(mediaPlan: string) {
    const data = await this.Model.find({ mediaPlan });
    return data.map((ch) => ch.toJSON({ flattenObjectIds: true }));
  }

  edit(_id: string, channel: UpdateChannelBody) {
    const updateQuery = formUpdateChannelQuery(channel);

    return this.Model.findOneAndUpdate({ _id }, updateQuery, {
      new: true,
      runValidators: true
    }).orFail(NotFound(`Channel ${_id} not found`));
  }

  async getMetricsByMediaPlanId(mediaPlanId: string) {
    const [result] = await this.Model.aggregate()
      .match({ mediaPlan: new Types.ObjectId(mediaPlanId) })
      .group({
        _id: 1,
        impressions: { $sum: '$impressions' },
        views: { $sum: '$views' },
        clicks: { $sum: '$clicks' },
        listens: { $sum: '$listens' }
      });

    return result ?? { impressions: 0, views: 0, clicks: 0, listens: 0 };
  }
}
