import { GetCampaignsByClients } from '@domains/interfaces/use-cases';
import { CampaignRepo } from '@domains/interfaces/repositories';

export class GetCampaignListByClientsIdsUC implements GetCampaignsByClients {
  constructor(private campaignRepository: CampaignRepo) {}

  exec(clients: string | string[]) {
    return this.campaignRepository.findByClientIds(Array.isArray(clients) ? clients : [clients]);
  }
}
