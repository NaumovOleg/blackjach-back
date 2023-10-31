import { CreateMediaPlanRequest, MediaPlanFlatten, MediaPlan } from '@skyrise-eng/types';
import { NotFound } from 'http-errors';
import { MediaPlanListRequest } from '@domains/interfaces/models';
import { MediaPlanCoreWrapper } from '@src/data/interfaces/wrappers';
import { getSkipLimit, Core } from '@utils';
import { ChannelModel } from '@src/data/mongo/models/channel/model';
import { MediaPlanModel } from './model';
import { getMediaPlanListSearchQuery, mediaListFilterQueries, getSortMediaListQuery } from '../helper';

export class MediaPlanCore extends Core<MediaPlan, CreateMediaPlanRequest> implements MediaPlanCoreWrapper {
  protected Model = MediaPlanModel;

  protected ModelName = 'Media plan';

  protected ChannelModel = ChannelModel;

  aggregateMediaListQuery(params: MediaPlanListRequest) {
    const match = params.search ? getMediaPlanListSearchQuery(params.search) : {};

    const filter = {};
    if (params.filter) {
      const { matchFilter, matchChannels } = mediaListFilterQueries(params.filter);
      Object.assign(match, matchChannels);
      Object.assign(filter, matchFilter);
    }

    return this.Model.aggregate()
      .match(filter)
      .lookup({
        from: 'channels',
        as: 'channels',
        let: { id: '$_id' },
        pipeline: [
          { $match: { $expr: { $eq: ['$mediaPlan', '$$id'] } } },
          { $group: { _id: 0, list: { $addToSet: '$channel' } } }
        ]
      })
      .lookup({ from: 'clients', as: 'client', foreignField: '_id', localField: 'client' })
      .lookup({ from: 'campaigns', as: 'campaign', localField: 'campaign', foreignField: '_id' })
      .unwind({ path: '$channels', preserveNullAndEmptyArrays: true })
      .unwind({ path: '$client', preserveNullAndEmptyArrays: true })
      .unwind({ path: '$campaign', preserveNullAndEmptyArrays: true })
      .replaceRoot({ $mergeObjects: ['$$ROOT', { channels: '$channels.list' }] })
      .match(match);
  }

  async getList(params: MediaPlanListRequest) {
    const dataQuery = this.aggregateMediaListQuery(params);
    const countQuery = this.aggregateMediaListQuery(params);
    const { skip, limit } = getSkipLimit(params.pagination);
    const sortBy = getSortMediaListQuery(params.sort);

    const dataPromise = dataQuery
      .lookup({ from: 'users', as: 'manager', localField: 'manager', foreignField: '_id' })
      .unwind('manager')
      .sort({ [sortBy]: params.order })
      .skip(skip)
      .limit(limit);

    const countPromise = await countQuery.count('count');
    const [[countResp], data] = await Promise.all([countPromise, dataPromise]);

    return { data, count: countResp?.count ?? 0 };
  }

  findByIdWithPopulate(mediaPlanId: string) {
    return this.Model.findById(mediaPlanId)
      .populate('client')
      .populate('campaign')
      .populate<MediaPlanFlatten<string>>('manager')
      .orFail(NotFound(`Media plan ${mediaPlanId} not found`))
      .lean();
  }
}

setTimeout(async () => {
  const mediaPlans = await MediaPlanModel.aggregate()
    .lookup({
      from: 'clients',
      as: 'clientss',
      foreignField: '_id',
      localField: 'client'
    })
    .match({
      clientss: []
    });
  console.log(mediaPlans);
}, 2000);
