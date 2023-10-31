import { Channel, RateCard, RateCardOptionsQuery } from '@skyrise-eng/types';
import { RateCardSource } from '@data/interfaces/data-sources';
import { RateCardCoreWrapper } from '@data/interfaces/wrappers';
import { Source } from '@utils';
import { RateCardListRequest } from '@domains/interfaces/models';

export class RateCardDataSource extends Source<RateCard> implements RateCardSource {
  protected Core: RateCardCoreWrapper;

  getOptions(query: RateCardOptionsQuery) {
    return this.Core.getOptions(query);
  }

  getList(params: RateCardListRequest) {
    return this.Core.getList(params);
  }

  findByChannelData(channel: Partial<Channel>) {
    return this.Core.findByChannelData(channel);
  }
}
