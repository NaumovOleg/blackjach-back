import { DeleteRateCard } from '@domains/interfaces/use-cases';
import { RateCardRepo } from '@domains/interfaces/repositories';

export class DeleteRateCardUC implements DeleteRateCard {
  constructor(private rateCardRepo: RateCardRepo) {}

  exec(id: string) {
    return this.rateCardRepo.deleteById(id);
  }
}
