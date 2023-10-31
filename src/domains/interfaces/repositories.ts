import {
  MediaPlan,
  User,
  Client,
  Channel,
  CreateMediaPlanRequest,
  PromiseListResponse,
  CreateChannelRequest,
  UpdateMediaPlanRequest,
  MediaPlanFlatten,
  RateCard,
  RateCardOptionsQuery,
  RateCardOptions,
  Campaign,
  CalculatedMetrics
} from '@skyrise-eng/types';
import {
  MediaPlanListRequest,
  ChannelListRequest,
  UpdateChannelBody,
  UserListPagination,
  RateCardListRequest,
  Deal
} from '@domains/interfaces/models';
import { CRUD } from '@utils';

export interface ConnectionRepo {
  openConnection(): Promise<any>;
  closeConnection(): Promise<any>;
}

export interface UserRepo extends CRUD<User> {
  findByEmail(email: string): Promise<User | null>;
  getList(pagination: UserListPagination): Promise<{ count: number; data: User[] }>;
}

export interface MediaPlanRepo extends CRUD<MediaPlan, CreateMediaPlanRequest, UpdateMediaPlanRequest> {
  getList(params: MediaPlanListRequest): PromiseListResponse<MediaPlanFlatten<string>>;
  find(id: string): Promise<MediaPlanFlatten<string>>;
  updateById(id: string, mediaPlan: UpdateMediaPlanRequest): Promise<MediaPlan>;
  refreshMediaPlan(id: string): Promise<MediaPlan | null>;
}

export interface ClientRepo extends CRUD<Client> {
  getList(): Promise<Client[]>;
  bulkCreateIfNotExists(clients: Client[]): Promise<Client[]>;
  upsertOne(client: Omit<Client, '_id'>): Promise<Client>;
}

export interface ChannelRepo extends CRUD<Channel, CreateChannelRequest, UpdateChannelBody> {
  getList(params: ChannelListRequest): PromiseListResponse<Channel>;
  getChannelsTotalBudget(mediaPlan: string, excludeChannel?: string): Promise<number>;
  createAndCheckDraft(channel: CreateChannelRequest): Promise<Channel>;
  delete(params: string[]): Promise<{ deletedCount: number }>;
  delete(params: string): Promise<Channel>;
  edit(id: string, channel: UpdateChannelBody): Promise<Channel>;
  getManyByMediaId(mediaId: string): Promise<Channel[]>;
  getMetricsByMediaPlanId(mediaPlanId: string): Promise<CalculatedMetrics>;
}

export interface RateCardRepo extends CRUD<RateCard> {
  getOptions(query: RateCardOptionsQuery): Promise<RateCardOptions>;
  getList(params: RateCardListRequest): PromiseListResponse<RateCard>;
  findByChannelData(channel: Partial<Channel>): Promise<RateCard | null>;
}

export interface DealRepo {
  fetchAllFromPipeDrive(start?: number, limit?: number): Promise<Deal[]>;
  getDealProductsPrice(dealId: Deal['campaignId']): Promise<number>;
}

export interface CampaignRepo extends CRUD<Campaign> {
  bulkCreateIfNotExists(campaigns: Omit<Campaign, '_id'>[]): Promise<Campaign[]>;
  findByClientIds(clients: string[]): Promise<Campaign[]>;
}

export interface PdfRepo {
  generateCampaignHtml(
    mediaPlan: MediaPlanFlatten<string>,
    channels: Channel[],
    isLastChunk: boolean
  ): Promise<string>;
}
