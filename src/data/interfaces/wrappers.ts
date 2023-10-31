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
  RateCardListRequest
} from '@domains/interfaces/models';
import { CRUD } from '@utils';

export interface UserCoreWrapper extends CRUD<User, User, Partial<Omit<User, '_id'>>> {
  findByEmail(email: string): Promise<User | null>;
  findAll(pagination: UserListPagination): Promise<{ count: number; data: User[] }>;
}

export interface ConnectionWrapper {
  open(): Promise<any>;
  close(): Promise<any>;
}

export interface MediaPlanCoreWrapper
  extends CRUD<MediaPlan, CreateMediaPlanRequest, UpdateMediaPlanRequest> {
  getList(params: MediaPlanListRequest): PromiseListResponse<MediaPlanFlatten<string>>;
  findByIdWithPopulate(mediaPlan: string): Promise<MediaPlanFlatten<string>>;
}

export interface ClientCoreWrapper extends CRUD<Client> {
  findAll(): Promise<Client[]>;
  bulkCreateIfNotExists(clients: Omit<Client, '_id'>[]): Promise<Client[]>;
  upsertOne(client: Omit<Client, '_id'>): Promise<Client>;
}

export interface ChannelCoreWrapper extends CRUD<Channel, CreateChannelRequest, UpdateChannelBody> {
  getList(params: ChannelListRequest): PromiseListResponse<Channel>;
  deleteByMediaIds(mediaIds: string[]): Promise<{ deletedCount: number }>;
  getManyByMediaId(mediaId: string): Promise<Channel[]>;
  edit(id: string, channel: UpdateChannelBody): Promise<Channel>;
  getMetricsByMediaPlanId(mediaPlanId: string): Promise<CalculatedMetrics>;
}

export interface RateCardCoreWrapper extends CRUD<RateCard> {
  getOptions(query: RateCardOptionsQuery): Promise<RateCardOptions>;
  getList(params: RateCardListRequest): PromiseListResponse<RateCard>;
  findByChannelData(channel: Partial<Channel>): Promise<RateCard | null>;
}

export interface CampaignCoreWrapper extends CRUD<Campaign> {
  bulkCreateIfNotExists(campaigns: Omit<Campaign, '_id'>[]): Promise<Campaign[]>;
  findByClientIds(clients: string[]): Promise<Campaign[]>;
}
