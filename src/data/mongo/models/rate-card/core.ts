import { RateCard, RateCardOptions, RateCardOptionsQuery, Channel } from '@skyrise-eng/types';
import { RateCardCoreWrapper } from '@src/data/interfaces/wrappers';
import { getSkipLimit, Core } from '@utils';
import { formInQuery, getFilterQuery } from '@data/mongo/models/helper';
import { RateCardListRequest } from '@domains/interfaces/models';
import { RateCardModel } from './model';

export class RateCardCore extends Core<RateCard> implements RateCardCoreWrapper {
  protected Model = RateCardModel;

  protected ModelName = 'Rate card';

  async getList(params: RateCardListRequest) {
    const { skip, limit } = getSkipLimit(params.pagination);

    const options = params.filter ? getFilterQuery(params.filter) : {};
    const query = this.Model.find(options);

    const resultQuery = query
      .clone()
      .sort({ [params.sort ?? 'channel']: params.order })
      .skip(skip)
      .limit(limit)
      .lean<RateCard[]>();

    return {
      data: await resultQuery,
      count: await query.countDocuments()
    };
  }

  async getOptions({ showDraft, ...query }: RateCardOptionsQuery) {
    const preserveNullAndEmptyArrays = !!showDraft;

    const optionsQuery = this.Model.aggregate<RateCardOptions>()
      .match(formInQuery(query))
      .sort({ _id: 1 })
      .unwind({ path: '$formats', preserveNullAndEmptyArrays })
      .unwind({ path: '$kpis', preserveNullAndEmptyArrays })
      .group({
        _id: 1,
        sellRates: { $addToSet: '$sellRate' },
        kpis: { $addToSet: '$kpis' },
        formats: { $addToSet: '$formats' },
        tactics: { $addToSet: '$tactic' },
        buyingMetrics: { $addToSet: '$buyingMetric' },
        monthlySpent: { $addToSet: '$monthlySpent' }
      });

    const productsQuery = this.Model.aggregate<Pick<RateCardOptions, 'products'>>()
      .match({ channel: { $in: query.channel ?? [] }, ...(!showDraft && { isDraft: false }) })
      .sort({ _id: 1 })
      .group({ _id: 1, products: { $addToSet: '$product' } });

    const channelsQuery = this.Model.find(showDraft ? {} : { isDraft: false })
      .select('channel')
      .then((resp) => resp.map(({ channel }) => channel));

    const [[response], [products], channels] = await Promise.all([
      optionsQuery,
      productsQuery,
      channelsQuery
    ]);

    return { channels: [...new Set(channels)], ...(response ?? {}), ...(products ?? {}) };
  }

  findByChannelData(data: Partial<Channel>) {
    return this.Model.findOne({
      channel: data.channel,
      product: data.product,
      kpis: { $all: [data.kpi] },
      formats: { $all: data.formats },
      isDraft: false
    });
  }
}
