import { UpdateMediaPlanRequest } from '@skyrise-eng/types';
import { UpdateMediaPlan } from '@domains/interfaces/use-cases';
import { MediaPlanRepo } from '@domains/interfaces/repositories';
import { BudgetValidator } from '@domains/interfaces/validators';

export class UpdateMediaPlanUC implements UpdateMediaPlan {
  constructor(private mediaPlanRepository: MediaPlanRepo, private budgetValidator: BudgetValidator) {}

  async exec(id: string, mediaPlan: UpdateMediaPlanRequest) {
    await this.budgetValidator.validateMediaPlanBudget(id, mediaPlan.totalBudget);
    return this.mediaPlanRepository.updateById(id, mediaPlan);
  }
}
