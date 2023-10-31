import { InternalServerError } from 'http-errors';
import { EditChannel } from '@domains/interfaces/use-cases';
import { UpdateChannelBody } from '@domains/interfaces/models';
import { ChannelRepo } from '@domains/interfaces/repositories';
import { BudgetValidator } from '@domains/interfaces/validators';

export class UpdateChannelUC implements EditChannel {
  constructor(private channelRepository: ChannelRepo, private budgetValidator: BudgetValidator) {}

  async exec(channelId: string, channel: UpdateChannelBody) {
    if (channel.mediaPlan) {
      throw new InternalServerError('Not able to edit  media plan');
    }
    const channelRecord = await this.channelRepository.findById(channelId);
    if (!channel.saveAsDraft) {
      await this.budgetValidator.validateChannelBudget(channelRecord.mediaPlan, channel.budget, channelId);
    }

    await this.budgetValidator.compareChannelAndMonthlyBudget(channel);
    return this.channelRepository.edit(channelId, channel);
  }
}
