import { FindMediaPlan } from '@domains/interfaces/use-cases';
import { MediaPlanRepo, ChannelRepo } from '@domains/interfaces/repositories';

export class GetMediaPlanUC implements FindMediaPlan {
  constructor(private mediaPlanRepository: MediaPlanRepo, private channelRepository: ChannelRepo) {}

  async exec(mediaPlanId: string) {
    const metrics = await this.channelRepository.getMetricsByMediaPlanId(mediaPlanId);

    const mediaPlan = await this.mediaPlanRepository.find(mediaPlanId);

    return { ...metrics, ...mediaPlan };
  }
}
