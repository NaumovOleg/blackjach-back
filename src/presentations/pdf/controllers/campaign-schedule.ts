import { resToJson } from '@utils';
import { UserAuth } from '@domains/interfaces/models';
import { generateCampaignRepository } from '@src/domains';

export const getCampaignPdf = resToJson<{ mediaPlan: string }, Buffer[], any, any, UserAuth>(
  async ({ params }) => {
    const templates = await generateCampaignRepository.exec(params.mediaPlan);
    return templates.map(Buffer.from);
  }
);
