import { Channel } from '@skyrise-eng/types';
import { CalculateMetrics } from '@domains/interfaces/use-cases';
import { MediaPlanRepo, RateCardRepo } from '@domains/interfaces/repositories';
import { calculateMarginPerChannel, calculateMetrics } from '@utils';

export class CalculateMetricsUC implements CalculateMetrics {
  constructor(private mediaPlanRepository: MediaPlanRepo, private rateCardRepository: RateCardRepo) {}

  async exec(mediaPlanId: string, channel: Partial<Channel>) {
    const [rateCard, mediaPlanData] = await Promise.all([
      this.rateCardRepository.findByChannelData(channel),
      this.mediaPlanRepository.findById(mediaPlanId)
    ]);

    if (!rateCard)
      return { marginPercent: 0, marginAbsolute: 0, impressions: 0, clicks: 0, views: 0, listens: 0 };

    const { marginPercent, marginAbsolute } = calculateMarginPerChannel(mediaPlanData, channel, rateCard);
    const metrics = calculateMetrics(channel, rateCard);

    return { marginPercent, marginAbsolute, ...metrics };
  }
}
