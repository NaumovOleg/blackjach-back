import { GetChannelsBudget } from '@domains/interfaces/use-cases';
import { ChannelRepo } from '@domains/interfaces/repositories';

export class GetChannelsBudgetUC implements GetChannelsBudget {
  constructor(private channelRepository: ChannelRepo) {}

  exec(mediaPlanId: string, excludeChannel?: string) {
    return this.channelRepository.getChannelsTotalBudget(mediaPlanId, excludeChannel);
  }
}
