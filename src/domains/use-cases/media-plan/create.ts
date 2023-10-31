import { CreateMediaPlanRequest } from '@skyrise-eng/types';
import { CreateMediaPlan } from '@domains/interfaces/use-cases';
import { MediaPlanRepo } from '@domains/interfaces/repositories';

export class CreateMediaPlanUC implements CreateMediaPlan {
  constructor(private mediaPlanRepository: MediaPlanRepo) {}

  exec(mediaPlan: CreateMediaPlanRequest) {
    return this.mediaPlanRepository.create(mediaPlan);
  }
}
