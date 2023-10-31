import { RefreshMediaPlan } from '@domains/interfaces/use-cases';
import { MediaPlanRepo } from '@domains/interfaces/repositories';

export class RefreshMediaPlanUC implements RefreshMediaPlan {
  constructor(private mediaPlanRepository: MediaPlanRepo) {}

  exec(id: string) {
    return this.mediaPlanRepository.refreshMediaPlan(id);
  }
}
