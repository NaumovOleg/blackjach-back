import {
  MediaPlan,
  User,
  Client,
  Channel,
  PromiseListResponse,
  CreateMediaPlanRequest,
  CreateChannelRequest,
  UpdateMediaPlanRequest,
  MediaPlanFlatten,
  RateCard,
  RateCardOptions,
  RateCardOptionsQuery,
  Campaign,
  CalculatedMetrics
} from '@skyrise-eng/types';
import {
  MediaPlanListRequest,
  ChannelListRequest,
  UpdateChannelBody,
  UserListPagination,
  RateCardListRequest,
  PipeDriveDealsResponse,
  Deal,
  DealProduct
} from '@domains/interfaces/models';
import { CRUD } from '@utils';

export interface UserSource extends CRUD<User, User, Partial<Omit<User, '_id'>>> {
  findByEmail(email: string): Promise<User | null>;
  getList(pagination: UserListPagination): Promise<{ count: number; data: User[] }>;
}

export interface MediaPlanSource extends CRUD<MediaPlan, CreateMediaPlanRequest, UpdateMediaPlanRequest> {
  getList(params: MediaPlanListRequest): PromiseListResponse<MediaPlanFlatten<string>>;
  find(mediaPlanId: string): Promise<MediaPlanFlatten<string>>;
}

export interface ClientSource extends CRUD<Client> {
  findAll(): Promise<Client[]>;
  bulkCreateIfNotExists(clients: Omit<Client, '_id'>[]): Promise<Client[]>;
  upsertOne(client: Omit<Client, '_id'>): Promise<Client>;
}

export interface ChannelSource extends CRUD<Channel, CreateChannelRequest, UpdateChannelBody> {
  getList(params: ChannelListRequest): PromiseListResponse<Channel>;
  deleteByMediaIds(mediaIds: string[]): Promise<{ deletedCount: number }>;
  getManyByMediaId(mediaId: string): Promise<Channel[]>;
  edit(id: string, channel: UpdateChannelBody): Promise<Channel>;
  getMetricsByMediaPlanId(mediaPlanId: string): Promise<CalculatedMetrics>;
}

export interface RateCardSource extends CRUD<RateCard> {
  getOptions(query: RateCardOptionsQuery): Promise<RateCardOptions>;
  getList(params: RateCardListRequest): PromiseListResponse<RateCard>;
  findByChannelData(channel: Partial<Channel>): Promise<RateCard | null>;
}

export interface CampaignSource extends CRUD<Campaign> {
  bulkCreateIfNotExists(campaigns: Omit<Campaign, '_id'>[]): Promise<Campaign[]>;
  findByClientIds(clients: string[]): Promise<Campaign[]>;
}

export interface PipeDriveSource {
  fetchDeals(start?: number, limit?: number): Promise<PipeDriveDealsResponse>;
  getProductsByDealId(dealId: Deal['campaignId']): Promise<DealProduct[]>;
}

export interface PdfSource {
  generateCampaignHtml(
    mediaPlan: MediaPlanFlatten<string>,
    channels: Channel[],
    isLastChunk: boolean
  ): Promise<string>;
}
