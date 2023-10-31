import { config } from 'node-config-ts';
import axios, { AxiosInstance } from 'axios';
import { PipeDriveSource } from '@data/interfaces/data-sources';
import { PipeDriveDealsResponse, DealProduct, Deal } from '@src/domains/interfaces/models';

export class PipeDriveDataSource implements PipeDriveSource {
  private Client: AxiosInstance = axios.create({ baseURL: 'https://api.pipedrive.com/v1' });

  constructor() {
    this.Client.interceptors.request.use((request) => ({
      ...request,
      url: `${request.url}?api_token=${config.PipeDriveApiToken}`
    }));
    this.Client.interceptors.response.use(({ data }) => data);
  }

  fetchDeals(start: number = 0, limit: number = 10): Promise<PipeDriveDealsResponse> {
    return this.Client.get('/deals', { params: { start, limit } });
  }

  getProductsByDealId(dealId: Deal['campaignId']): Promise<DealProduct[]> {
    return this.Client.get(`/deals/${dealId}/products`).then(({ data }) => data);
  }
}
