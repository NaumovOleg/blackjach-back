import { Campaign } from '@skyrise-eng/types';
import { CampaignSource } from '@data/interfaces/data-sources';
import { CampaignCoreWrapper } from '@data/interfaces/wrappers';
import { Source } from '@utils';

export class CampaignDataSource extends Source<Campaign> implements CampaignSource {
  protected Core: CampaignCoreWrapper;

  bulkCreateIfNotExists(campaigns: Campaign[]) {
    return this.Core.bulkCreateIfNotExists(campaigns);
  }

  findByClientIds(clients: string[]) {
    return this.Core.findByClientIds(clients);
  }
}
