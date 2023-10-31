import { RateCard } from '@skyrise-eng/types';
import { CreateRateCard } from '@domains/interfaces/use-cases';
import { RateCardRepo } from '@domains/interfaces/repositories';
import { isRateCardDraft } from '@utils';

export class CreateRateCardUC implements CreateRateCard {
  constructor(private rateCardRepo: RateCardRepo) {}

  exec(data: RateCard) {
    const isDraft = isRateCardDraft(data);

    return this.rateCardRepo.create({ ...data, isDraft });
  }
}
