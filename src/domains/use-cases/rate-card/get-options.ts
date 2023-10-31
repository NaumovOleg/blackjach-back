import { RateCardOptionsQuery } from '@skyrise-eng/types';
import { GetRateCardOptions } from '@domains/interfaces/use-cases';
import { RateCardRepo } from '@domains/interfaces/repositories';

export class GetRateCardOptionsUC implements GetRateCardOptions {
  constructor(private rateCardRepo: RateCardRepo) {}

  exec(query: RateCardOptionsQuery) {
    return this.rateCardRepo.getOptions(query);
  }
}
