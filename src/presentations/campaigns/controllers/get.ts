import { Campaign } from '@skyrise-eng/types';
import { resToJson } from '@utils';
import { UserAuth } from '@domains/interfaces/models';
import { getCampaignListByClientsIds } from '@src/domains';

export const getCampaignList = resToJson<{}, Campaign[], any, { client: string[] }, UserAuth>(({ query }) =>
  getCampaignListByClientsIds.exec(query.client)
);
