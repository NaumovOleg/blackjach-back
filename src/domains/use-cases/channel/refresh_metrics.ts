import { Channel, MediaPlan } from '@skyrise-eng/types';
import { RecalculateChannelsMetrics } from '@domains/interfaces/use-cases';
import { MediaPlanMetricsData } from '@domains/interfaces/models';
import { ChannelRepo, RateCardRepo } from '@domains/interfaces/repositories';
import { calculateMarginPerChannel } from '@utils';

export class RecalculateBatchChannelsMetricsUC implements RecalculateChannelsMetrics {
  constructor(private channelRepository: ChannelRepo, private rateCardRepository: RateCardRepo) {}

  async calculatePerChannel(mediaPlanData: MediaPlanMetricsData, channel: Channel) {
    const rateCard = await this.rateCardRepository.findByChannelData(channel);
    if (!rateCard) return { marginPercent: 0, marginAbsolute: 0 };

    const { marginPercent, marginAbsolute } = calculateMarginPerChannel(
      mediaPlanData as MediaPlan,
      channel,
      rateCard
    );

    return { marginPercent, marginAbsolute };
  }

  async exec(mediaPlan: MediaPlanMetricsData) {
    const channels = await this.channelRepository.getManyByMediaId(mediaPlan._id);
    const channelsDataToUpdatePromises = channels.map((ch) =>
      this.calculatePerChannel(mediaPlan, ch).then((resp) => ({ _id: ch._id, ...resp }))
    );

    const channelsData = await Promise.all(channelsDataToUpdatePromises);
    return Promise.all(
      channelsData.map(({ _id, ...margins }) => this.channelRepository.updateById(_id, margins))
    );
  }
}
