import {
  CreateMediaPlanRequest,
  UpdateMediaPlanRequest,
  MediaPlan,
  CHANNEL_MEDIA_PLAN_STATUS,
  BUYING_METRICS
} from '@skyrise-eng/types';
import { MediaPlanRepo } from '@domains/interfaces/repositories';
import { MediaPlanSource, ChannelSource, RateCardSource } from '@data/interfaces/data-sources';
import { MediaPlanListRequest } from '@domains/interfaces/models';
import { Repo } from '@utils';

export class MediaPlanRepository
  extends Repo<MediaPlan, CreateMediaPlanRequest, UpdateMediaPlanRequest>
  implements MediaPlanRepo
{
  protected Source: MediaPlanSource;

  constructor(
    source: MediaPlanSource,
    protected ChannelDataSource: ChannelSource,
    protected rateCardDataSource: RateCardSource
  ) {
    super(source);
  }

  async getList(params: MediaPlanListRequest) {
    return this.Source.getList(params);
  }

  find(mediaPlanId: string) {
    return this.Source.find(mediaPlanId);
  }

  async refreshMediaPlan(id: string) {
    const [channels, mediaPlan] = await Promise.all([
      this.ChannelDataSource.getManyByMediaId(id),
      this.Source.findById(id)
    ]);

    if (!channels.length) {
      return this.Source.updateById(id, { status: CHANNEL_MEDIA_PLAN_STATUS.DRAFT, marginPercent: 0 });
    }

    let { status } = channels[0];
    if (!channels.every((channel) => channel.status === status)) {
      status = CHANNEL_MEDIA_PLAN_STATUS.DRAFT;
    }

    let subtractMargin = 0;
    const flatFeeChannels = channels.filter(
      ({ buyingMetric, budget }) => buyingMetric === BUYING_METRICS.FLAT && !budget
    );
    if (flatFeeChannels.length) {
      const rateCards = await Promise.all(
        flatFeeChannels.map((ch) => this.rateCardDataSource.findByChannelData(ch))
      );
      subtractMargin = rateCards.reduce((acc, card) => (card?.buyRate ?? 0) + acc, 0);
    }

    const marginValue = channels.reduce((acc, ch) => ch.marginAbsolute + acc, 0) - subtractMargin;
    const marginPercent = Math.round((marginValue * 100) / mediaPlan.totalBudget);

    return this.Source.updateById(id, { status, marginPercent });
  }
}
