import { Campaign } from '@skyrise-eng/types';
import { CampaignRepo } from '@domains/interfaces/repositories';
import { CampaignSource } from '@data/interfaces/data-sources';
import { Repo } from '@utils';

export class CampaignRepository extends Repo<Campaign> implements CampaignRepo {
  protected Source: CampaignSource;

  bulkCreateIfNotExists(campaigns: Omit<Campaign, '_id'>[]) {
    return this.Source.bulkCreateIfNotExists(campaigns);
  }

  findByClientIds(clients: string[]) {
    return this.Source.findByClientIds(clients);
  }
}
