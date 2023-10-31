import { RateCardListRequest } from '@domains/interfaces/models';
import { GetRateCardList } from '@domains/interfaces/use-cases';
import { RateCardRepo } from '@domains/interfaces/repositories';

export class GetRateCardListOptionsUC implements GetRateCardList {
  constructor(private rateCardRepo: RateCardRepo) {}

  exec(params: RateCardListRequest) {
    return this.rateCardRepo.getList(params);
  }
}
