import { RateCard } from '@skyrise-eng/types';
import { EditRateCard } from '@domains/interfaces/use-cases';
import { RateCardRepo } from '@domains/interfaces/repositories';
import { isRateCardDraft } from '@utils';

export class EditRateCardUC implements EditRateCard {
  constructor(private rateCardRepo: RateCardRepo) {}

  async exec(id: string, data: RateCard) {
    const rateCard = await this.rateCardRepo.findById(id);

    const isDraft = isRateCardDraft({ ...rateCard, ...data });
    return this.rateCardRepo.updateById(id, { ...data, isDraft });
  }
}
