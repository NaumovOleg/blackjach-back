import moment from 'moment';
import { DealRepo } from '@domains/interfaces/repositories';
import { PipeDriveSource } from '@data/interfaces/data-sources';
import { PipeDriveDeal, Deal, AdvertiserField } from '@domains/interfaces/models';

const parseDeals = (deals: PipeDriveDeal[]): Deal[] =>
  deals
    .filter(({ add_time }) => moment(add_time).isAfter(moment('2023-01-01')))
    .map((deal) => {
      let advertiser;
      if (deal[AdvertiserField]) {
        advertiser = {
          name: deal[AdvertiserField]?.name,
          address: deal[AdvertiserField]?.address,
          email: deal[AdvertiserField]?.cc_email,
          ownerId: deal[AdvertiserField]?.owner_id,
          value: deal[AdvertiserField].value
        };
      }
      return {
        advertiser,
        name: deal.title,
        client: deal.org_name,
        totalBudget: deal.value,
        campaignId: deal.id
      };
    });

export class DealRepository implements DealRepo {
  constructor(protected Source: PipeDriveSource) {}

  async fetchAllFromPipeDrive(start: number = 0, limit: number = 10) {
    const { additional_data, data } = await this.Source.fetchDeals(start, limit);
    const dealsResponse = parseDeals(data);
    const dealsWithRecalculatedBudget = dealsResponse.map((deal) =>
      this.getDealProductsPrice(deal.campaignId).then((totalBudget) => ({ ...deal, totalBudget }))
    );

    const deals = await Promise.all(dealsWithRecalculatedBudget);

    // eslint-disable-next-line no-console
    console.debug('Fetching deals', start);

    if (!additional_data.pagination.more_items_in_collection) return deals;

    const nextDealBatch: Deal[] = await this.fetchAllFromPipeDrive(start + limit, limit);
    return deals.concat(nextDealBatch);
  }

  async getDealProductsPrice(campaignId: Deal['campaignId']) {
    const price = await this.Source.getProductsByDealId(campaignId).then((products) => {
      console.log(products);
      return products.reduce((sum, product) => sum + product.item_price ?? 0, 0);
    });
    return price ?? 0;
  }
}
