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
  RateCardOptions,
  RateCardOptionsQuery,
  RateCard,
  Campaign,
  MetricsResponse,
  CalculatedMetrics,
  CalculatedMargin
} from '@skyrise-eng/types';
import {
  MediaPlanListRequest,
  ChannelListRequest,
  UpdateChannelBody,
  UserListPagination,
  RateCardListRequest,
  PipedriveWebhookPayload,
  PipeDriveDeal,
  WebhookResponse,
  MediaPlanMetricsData
} from '@domains/interfaces/models';

export interface Connection {
  exec(): Promise<any>;
}

export interface FindUser {
  exec(id: string): Promise<User | null>;
}

export interface GetUserList {
  exec(pagination: UserListPagination): Promise<{ count: number; data: User[] }>;
}

export interface UpdateUser {
  exec(id: string, data: Partial<Omit<User, '_id'>>): Promise<User>;
}

export interface GetMediaPlanList {
  exec(params: MediaPlanListRequest): PromiseListResponse<MediaPlanFlatten<string>>;
}

export interface GetClientList {
  exec(): Promise<Client[]>;
}

export interface CreateMediaPlan {
  exec(mediaPlan: CreateMediaPlanRequest): Promise<MediaPlan>;
}

export interface UpdateMediaPlan {
  exec(id: string, mediaPlan: UpdateMediaPlanRequest): Promise<MediaPlan>;
}

export interface DeleteMediaPlan {
  exec(mediaPlanId: string): Promise<{ mediaPlan: MediaPlan; channels: number }>;
}

export interface FindMediaPlan {
  exec(mediaPlanId: string): Promise<MediaPlanFlatten<string> & CalculatedMetrics>;
}

export interface GetChannelsList {
  exec(params: ChannelListRequest): PromiseListResponse<Channel>;
}

export interface CreateChannel {
  exec(channel: CreateChannelRequest): Promise<Channel>;
}

export interface GetRateCardOptions {
  exec(query: RateCardOptionsQuery): Promise<RateCardOptions>;
}

export interface DeleteChannel {
  exec(channelId: string): Promise<Channel>;
}

export interface GetChannelsBudget {
  exec(mediaPLanId: string): Promise<number>;
}

export interface EditChannel {
  exec(channelId: string, channel: UpdateChannelBody): Promise<Channel>;
}

export interface CreateUser {
  exec(user: Omit<User, '_id'>): Promise<User>;
}

export interface DeleteUser {
  exec(id: string): Promise<User>;
}

export interface GetRateCardList {
  exec(params: RateCardListRequest): PromiseListResponse<RateCard>;
}

export interface CreateRateCard {
  exec(data: RateCard): Promise<RateCard>;
}

export interface EditRateCard {
  exec(id: string, data: RateCard): Promise<RateCard>;
}

export interface DeleteRateCard {
  exec(id: string): Promise<RateCard>;
}

export interface ObserveDeal {
  exec(data: PipedriveWebhookPayload): Promise<WebhookResponse> | null;
  observeUpdate(prevDeal: PipeDriveDeal, currentDeal: PipeDriveDeal): Promise<WebhookResponse>;
  observeCreate(deal: PipeDriveDeal): Promise<WebhookResponse>;
}

export interface GetCampaignsByClients {
  exec(clients: string | string[]): Promise<Campaign[]>;
}

export interface RefreshMediaPlan {
  exec(mediaPlanId: string): Promise<MediaPlan | null>;
}

export interface CalculateMetrics {
  exec(mediaPlanId: string, channel: Partial<Channel>): Promise<MetricsResponse>;
}

export interface GenerateCampaignPdf {
  exec(mediaPlanId: string): Promise<string[]>;
}

export interface RecalculateChannelsMetrics {
  calculatePerChannel(mediaPlanData: MediaPlanMetricsData, channel: Channel): Promise<CalculatedMargin>;
  exec(mediaPlanData: MediaPlanMetricsData): void;
}
