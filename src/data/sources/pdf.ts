import { MediaPlanFlatten, Channel, BUYING_METRICS, Override } from '@skyrise-eng/types';
import { PdfSource } from '@data/interfaces/data-sources';
import fs from 'fs';
import { join } from 'path';
import hb from 'handlebars';
import { formatDate, formatNumber } from '@src/utils';

enum KPI {
  VTR = 'vtr',
  LTR = 'ltr',
  CTR = 'ctr'
}

const getSum = (a: number = 0, b: number = 0) => a + b;
const getDate = (date?: Date) => (date ? formatDate(date) : 'N/A');
const getLocalString = (value?: number) => (value ? value.toLocaleString() : 'N/A');

const combineCtvChannels = (baseChannel: Channel, channel: Channel) => {
  const { product, kpi, budget, impressions, views, clicks, listens, ...ctvChannelData } = baseChannel;

  return {
    ...ctvChannelData,
    product: [product, channel.product].join(', '),
    budget: getSum(budget, channel.budget),
    impressions: getSum(impressions, channel.impressions),
    kpi,
    ...(kpi?.toLowerCase() === KPI.VTR && { views: getSum(views, channel.views) }),
    ...(kpi?.toLowerCase() === KPI.LTR && { listens: getSum(listens, channel.listens) }),
    ...(kpi?.toLowerCase() === KPI.CTR && { clicks: getSum(clicks, channel.clicks) })
  };
};

const formatChannels = (
  channels: Channel[]
): Override<
  Channel,
  {
    budget?: string;
    sellRate?: string;
    views?: string;
    impressions?: string;
    clicks?: string;
    listens?: string;
  }
>[] => {
  const channelsList = channels.filter(({ channel }) => channel.toLowerCase() !== 'ctv');
  const ctvChannels = channels.filter(({ channel }) => channel.toLowerCase() === 'ctv');

  const combined = channelsList.concat(ctvChannels.length ? ctvChannels.reduce(combineCtvChannels) : []);

  return combined.map((ch) => ({
    ...ch,
    budget: ch.budget?.toLocaleString('EN', { minimumFractionDigits: 2 }),
    sellRate: ch.sellRate?.toLocaleString('EN', { minimumFractionDigits: 2 }),
    views: getLocalString(ch.views),
    impressions: getLocalString(ch.impressions),
    clicks: getLocalString(ch.clicks),
    listens: getLocalString(ch.listens)
  }));
};

export class PdfDataSource implements PdfSource {
  private templatesFolder = process.env.LOCAL_RUN ? `${process.cwd()}/src` : './';

  async generateCampaignHtml(
    mediaPlan: MediaPlanFlatten<string>,
    channels: Channel[],
    isLastChunk: boolean
  ): Promise<string> {
    const metricsToShow = channels.reduce(
      (acc, { kpi }) => (kpi ? { ...acc, [kpi.toLowerCase()]: true } : acc),
      { [KPI.CTR]: false, [KPI.VTR]: false, [KPI.LTR]: false }
    );

    const channelsData = channels.map((channel) => {
      const { kpi, buyingMetric, impressions, startDate, endDate, clicks, views, listens } = channel;
      const kpiInLowerCase = kpi?.toLowerCase();
      const metrics = { impressions, clicks, views, listens };

      if ([BUYING_METRICS.FLAT, BUYING_METRICS.DISCLOSED].includes(buyingMetric as BUYING_METRICS)) {
        metrics.impressions = 0;
        metrics.clicks = 0;
        metrics.views = 0;
        metrics.listens = 0;
      }

      const isMetricNullable = (kpiValue: KPI) => !metricsToShow[kpiValue] || kpiInLowerCase !== kpiValue;

      if (isMetricNullable(KPI.CTR)) metrics.clicks = 0;
      if (isMetricNullable(KPI.VTR)) metrics.views = 0;
      if (isMetricNullable(KPI.LTR)) metrics.listens = 0;

      return {
        ...channel,
        ...metrics,
        startDate: getDate(startDate) as unknown as Date,
        endDate: getDate(endDate) as unknown as Date
      };
    });

    const discount = (mediaPlan.agencyDiscount / 100) * mediaPlan.totalBudget;
    const budgetWithDiscount = mediaPlan.totalBudget - discount;
    const campaignDates = `${getDate(mediaPlan.startDate)}-${getDate(mediaPlan.endDate)}`;

    const data = {
      mediaPlan: {
        ...mediaPlan,
        totalBudget: formatNumber(mediaPlan.totalBudget)
      },
      campaignDates,
      budgetWithDiscount: formatNumber(budgetWithDiscount),
      discount: formatNumber(discount),
      channels: formatChannels(channelsData),
      isLastChunk,
      ...metricsToShow
    };

    const html = await fs.readFileSync(join(this.templatesFolder, './templates/campaign.html'));

    hb.registerHelper('notfirst', (a, b) => !a && b);
    hb.registerHelper('isdefined', (value) => value !== undefined);

    const template = hb.compile(html.toString(), { strict: true });

    return template(data);
  }
}
