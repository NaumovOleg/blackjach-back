import { DealRepo, ClientRepo, CampaignRepo } from '@domains/interfaces/repositories';

export class SyncClientsAndCampaignsUC {
  constructor(
    private dealRepository: DealRepo,
    private clientRepository: ClientRepo,
    private campaignRepository: CampaignRepo
  ) {}

  async exec() {
    const deals = await this.dealRepository.fetchAllFromPipeDrive(0, 500);

    const upsertClientsQuery = [...new Set(deals)].map((deal) =>
      this.clientRepository
        .upsertOne({ name: deal.client })
        .then((result) => ({ ...deal, client: result._id }))
    );

    const campaignData = await Promise.all(upsertClientsQuery);

    const upsertedCampaigns = await this.campaignRepository.bulkCreateIfNotExists(campaignData);

    // eslint-disable-next-line no-console
    console.debug('Campaigns synchronized:', {
      clients: campaignData.length,
      campaigns: upsertedCampaigns.length
    });
  }
}
