import { CreateChannelRequest } from '@skyrise-eng/types';
import { CreateChannel } from '@domains/interfaces/use-cases';
import { ChannelRepo } from '@domains/interfaces/repositories';
import { BudgetValidator } from '@domains/interfaces/validators';

export class CreateChannelUC implements CreateChannel {
  constructor(private channelRepository: ChannelRepo, private budgetValidator: BudgetValidator) {}

  async exec(channel: CreateChannelRequest) {
    if (!channel.saveAsDraft) {
      await this.budgetValidator.validateChannelBudget(channel.mediaPlan, channel.budget);
    }

    await this.budgetValidator.compareChannelAndMonthlyBudget(channel);

    return this.channelRepository.createAndCheckDraft(channel);
  }
}
