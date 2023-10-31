import { Campaign } from '@skyrise-eng/types';
import { CampaignCoreWrapper } from '@src/data/interfaces/wrappers';
import { Core } from '@utils';
import { CampaignModel } from './model';

export class CampaignCore extends Core<Campaign> implements CampaignCoreWrapper {
  protected Model = CampaignModel;

  protected ModelName = 'Campaign';

  async bulkCreateIfNotExists(campaigns: Omit<Campaign, '_id'>[]) {
    return Promise.all(
      campaigns.map((campaign) =>
        this.Model.findOneAndUpdate({ campaignId: campaign.campaignId }, campaign, {
          upsert: true,
          new: true
        })
      )
    );
  }

  findByClientIds(clients: string[]) {
    return this.Model.find({ client: { $in: clients } }).lean();
  }
}
