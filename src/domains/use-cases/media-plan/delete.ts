import { DeleteMediaPlan } from '@domains/interfaces/use-cases';
import { MediaPlanRepo, ChannelRepo } from '@domains/interfaces/repositories';

export class DeleteMediaPlanUC implements DeleteMediaPlan {
  constructor(private mediaPlanRepository: MediaPlanRepo, private channelRepo: ChannelRepo) {}

  async exec(mediaPlanId: string) {
    const mediaPlan = await this.mediaPlanRepository.deleteById(mediaPlanId);
    const { deletedCount: channels } = await this.channelRepo.delete([mediaPlanId]);
    return { mediaPlan, channels };
  }
}
