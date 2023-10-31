import { UpdateChannelBody } from '@domains/interfaces/models';

export interface BudgetValidator {
  validateChannelBudget(
    mediaPlanId: string,
    channelBudget?: number | null,
    excludeChannel?: string
  ): Promise<void>;
  validateMediaPlanBudget(mediaPlanId: string, budget?: number | null): Promise<void>;
  compareChannelAndMonthlyBudget(channel: UpdateChannelBody): Promise<void>;
}
