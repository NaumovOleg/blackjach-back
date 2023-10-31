import { Conflict } from 'http-errors';
import { BudgetValidator } from '@domains/interfaces/validators';
import { UpdateChannelBody } from '@domains/interfaces/models';
import { MediaPlanRepo, ChannelRepo, RateCardRepo } from '@domains/interfaces/repositories';

const normalizeChannelData = (channel: UpdateChannelBody) =>
  Object.entries(channel).reduce((acc, [key, val]) => (val === null ? acc : { ...acc, [key]: val }), {});

export class ChannelBudget implements BudgetValidator {
  constructor(
    private mediaPlanRepo: MediaPlanRepo,
    private channelRepo: ChannelRepo,
    private rateCardRepo: RateCardRepo
  ) {}

  async validateChannelBudget(mediaPlanId: string, channelBudget: number = 0, excludeChannel?: string) {
    const [mediaPlan, channelsTotalBudget] = await Promise.all([
      this.mediaPlanRepo.find(mediaPlanId),
      this.channelRepo.getChannelsTotalBudget(mediaPlanId, excludeChannel)
    ]);
    const totalChannelBudget = channelsTotalBudget + channelBudget;

    if (totalChannelBudget > mediaPlan.totalBudget) {
      throw new Conflict(`Invalid total budget ${totalChannelBudget}`);
    }
  }

  async compareChannelAndMonthlyBudget(channel: UpdateChannelBody) {
    const card = await this.rateCardRepo.findByChannelData(normalizeChannelData(channel));
    const monthlySpent = card?.monthlySpent ?? 0;
    const budget = channel?.budget ?? 0;
    if (!channel.saveAsDraft && monthlySpent > budget) {
      throw new Conflict(`The total budget should be greater than minimum monthly spent `);
    }
  }

  async validateMediaPlanBudget(mediaPlanId: string, budget: number = 0) {
    const channelsBudget = await this.channelRepo.getChannelsTotalBudget(mediaPlanId);
    if (channelsBudget > budget) {
      throw new Conflict(`The total budget should be equal to or greater than ${channelsBudget}`);
    }
  }
}
