import { MediaPlan } from '@skyrise-eng/types';
import { ObserveDeal } from '@domains/interfaces/use-cases';
import { ClientRepo, CampaignRepo, MediaPlanRepo, DealRepo } from '@domains/interfaces/repositories';
import { PipedriveWebhookPayload, PipeDriveDeal, AdvertiserField } from '@domains/interfaces/models';

export class ObserveDealUC implements ObserveDeal {
  constructor(
    private mediaPlanRepository: MediaPlanRepo,
    private clientRepository: ClientRepo,
    private campaignRepository: CampaignRepo,
    private dealRepository: DealRepo
  ) {}

  updateMediaPlanBudget(campaign: string, totalBudget: number): Promise<MediaPlan | null> {
    return this.mediaPlanRepository
      .updateOne({ campaign }, { totalBudget })
      .then(({ _id }) => this.mediaPlanRepository.refreshMediaPlan(_id))
      .catch((err) => {
        console.error(err);
        return null;
      });
  }

  async observeUpdate(prevDeal: PipeDriveDeal, currentDeal: PipeDriveDeal) {
    const client = await this.clientRepository.findOne({ name: prevDeal.org_name });
    const campaign = await this.campaignRepository.findOne({
      campaignId: currentDeal.id
    });

    const recalculatedMediaPlanPromise =
      prevDeal.value === currentDeal.value
        ? null
        : this.updateMediaPlanBudget(campaign._id, currentDeal.value).catch(console.debug);

    const totalBudget = await this.dealRepository.getDealProductsPrice(currentDeal.id);

    const [updatedClient, updatedCampaign, updatedMediaPlan] = await Promise.all([
      this.clientRepository.updateById(client._id, { name: currentDeal.org_name }),
      this.campaignRepository.updateById(campaign._id, { totalBudget, name: currentDeal.title }),
      recalculatedMediaPlanPromise
    ]);
    console.debug('Updated  resources:', { client, campaign, updatedMediaPlan });
    return { client: updatedClient, campaign: updatedCampaign };
  }

  async observeCreate(deal: PipeDriveDeal) {
    const client = await this.clientRepository.upsertOne({ name: deal.org_name });
    const advertiser = deal[AdvertiserField]
      ? {
          name: deal[AdvertiserField].name,
          address: deal[AdvertiserField].address,
          email: deal[AdvertiserField].cc_email,
          ownerId: deal[AdvertiserField].owner_id,
          value: deal[AdvertiserField].value
        }
      : undefined;

    const totalBudget = await this.dealRepository.getDealProductsPrice(deal.id);
    const campaign = await this.campaignRepository.create({
      totalBudget,
      name: deal.title,
      client: client._id,
      campaignId: deal.id,
      advertiser
    });

    console.debug('Created  resources:', client, campaign);
    return { client, campaign };
  }

  exec(body: PipedriveWebhookPayload) {
    console.debug(JSON.stringify(body, null, 2));
    const { current, previous } = body;

    if (body.meta.action === 'added') {
      return this.observeCreate(current);
    }
    if (body.meta.action === 'updated') {
      return this.observeUpdate(previous!, current);
    }
    return null;
  }
}
