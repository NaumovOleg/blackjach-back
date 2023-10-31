import { Channel, RateCard, RateCardOptionsQuery } from '@skyrise-eng/types';
import { RateCardRepo } from '@domains/interfaces/repositories';
import { RateCardSource } from '@data/interfaces/data-sources';
import { Repo } from '@utils';
import { RateCardListRequest } from '@domains/interfaces/models';

export class RateCardRepository extends Repo<RateCard> implements RateCardRepo {
  protected Source: RateCardSource;

  getOptions(query: RateCardOptionsQuery) {
    return this.Source.getOptions(query);
  }

  getList(params: RateCardListRequest) {
    return this.Source.getList(params);
  }

  findByChannelData(channel: Partial<Channel>) {
    return this.Source.findByChannelData(channel);
  }
}
