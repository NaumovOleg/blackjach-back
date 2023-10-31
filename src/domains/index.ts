import {
  UserCore,
  MediaPlanCore,
  ClientCore,
  ChannelCore,
  RateCardCore,
  CampaignCore
} from '@data/mongo/core';
import {
  UserDataSource,
  MediaPlanDataSource,
  ClientDataSource,
  ChannelDataSource,
  RateCardDataSource,
  PipeDriveDataSource,
  CampaignDataSource,
  PdfDataSource
} from '@data/sources';
import {
  UseRepository,
  MediaPlanRepository,
  ClientRepository,
  ChannelRepository,
  RateCardRepository,
  DealRepository,
  CampaignRepository,
  PdfRepository
} from '@domains/repositories';
import { FindUserUC, GetUserListUC, CreateUserUC, UpdateUserUC, DeleteUserUC } from '@domains/use-cases/user';
import {
  GetMediaPlanListUC,
  CreateMediaPlanUC,
  DeleteMediaPlanUC,
  GetMediaPlanUC,
  UpdateMediaPlanUC,
  RefreshMediaPlanUC,
  GenerateCampaignPdfUC
} from '@domains/use-cases/media-plan';
import { GetClientListUC, SyncClientsAndCampaignsUC } from '@domains/use-cases/client';
import {
  GetRateCardOptionsUC,
  GetRateCardListOptionsUC,
  CreateRateCardUC,
  EditRateCardUC,
  DeleteRateCardUC
} from '@domains/use-cases/rate-card';
import {
  GetChannelListUC,
  CreateChannelUC,
  DeleteChannelUC,
  GetChannelsBudgetUC,
  UpdateChannelUC,
  CalculateMetricsUC,
  RecalculateBatchChannelsMetricsUC
} from '@domains/use-cases/channel';
import { ChannelBudget } from '@domains/use-cases/use-case-validators';
import { ObserveDealUC } from '@domains/use-cases/webhooks';
import { GetCampaignListByClientsIdsUC } from '@domains/use-cases/campaign';

/** DATA SOURCES */
const userDataSource = new UserDataSource(new UserCore());
const mediaPlanDataSource = new MediaPlanDataSource(new MediaPlanCore());
const clientDataSource = new ClientDataSource(new ClientCore());
const channelDataSource = new ChannelDataSource(new ChannelCore());
const rateCardDataSource = new RateCardDataSource(new RateCardCore());
const pipeDriveDataSource = new PipeDriveDataSource();
const campaignDataSource = new CampaignDataSource(new CampaignCore());
const pdfDataSource = new PdfDataSource();

/** REPOSITORIES */
const userRepository = new UseRepository(userDataSource);
const mediaPlanRepository = new MediaPlanRepository(
  mediaPlanDataSource,
  channelDataSource,
  rateCardDataSource
);
const clientRepository = new ClientRepository(clientDataSource);
const channelRepository = new ChannelRepository(channelDataSource);
const rateCardRepository = new RateCardRepository(rateCardDataSource);
const dealRepository = new DealRepository(pipeDriveDataSource);
const campaignRepository = new CampaignRepository(campaignDataSource);
const pdfRepository = new PdfRepository(pdfDataSource);

/** VALIDATORS */
const budgetValidator = new ChannelBudget(mediaPlanRepository, channelRepository, rateCardRepository);

/** USE CASES */

// User
export const getUserUseCase = new FindUserUC(userRepository);
export const getUserListUseCase = new GetUserListUC(userRepository);
export const createUserUseCase = new CreateUserUC(userRepository);
export const updateUserUseCase = new UpdateUserUC(userRepository);
export const deleteUserUseCase = new DeleteUserUC(userRepository);

// Media plan
export const getMediaPlanListUseCase = new GetMediaPlanListUC(mediaPlanRepository);
export const createMediaPlanUseCase = new CreateMediaPlanUC(mediaPlanRepository);
export const deleteMediaPlanUseCase = new DeleteMediaPlanUC(mediaPlanRepository, channelRepository);
export const getMediaPlanUseCase = new GetMediaPlanUC(mediaPlanRepository, channelRepository);
export const updateMediaPlanUseCase = new UpdateMediaPlanUC(mediaPlanRepository, budgetValidator);
export const refreshMediaPlanUseCase = new RefreshMediaPlanUC(mediaPlanRepository);
export const generateCampaignRepository = new GenerateCampaignPdfUC(
  pdfRepository,
  mediaPlanRepository,
  channelRepository
);

// Client
export const getClientListUseCase = new GetClientListUC(clientRepository);
export const syncClientsAndCampaignsUseCase = new SyncClientsAndCampaignsUC(
  dealRepository,
  clientRepository,
  campaignRepository
);

// Channel
export const getChannelListUseCase = new GetChannelListUC(channelRepository);
export const deleteChannelUseCase = new DeleteChannelUC(channelRepository);
export const getChannelsBudgetUseCase = new GetChannelsBudgetUC(channelRepository);
export const updateChannelUseCase = new UpdateChannelUC(channelRepository, budgetValidator);
export const createChannelUseCase = new CreateChannelUC(channelRepository, budgetValidator);
export const calculateMetricsUseCase = new CalculateMetricsUC(mediaPlanRepository, rateCardRepository);
export const refreshBatchMargins = new RecalculateBatchChannelsMetricsUC(
  channelRepository,
  rateCardRepository
);

// Rate card
export const getRateCardListUseCase = new GetRateCardListOptionsUC(rateCardRepository);
export const createRateCardUseCase = new CreateRateCardUC(rateCardRepository);
export const getRateCardOptionsUseCase = new GetRateCardOptionsUC(rateCardRepository);
export const updateRateCardUseCase = new EditRateCardUC(rateCardRepository);
export const deleteRateCardUseCase = new DeleteRateCardUC(rateCardRepository);

// Campaign
export const getCampaignListByClientsIds = new GetCampaignListByClientsIdsUC(campaignRepository);

// Web hooks
export const observeDealUseCase = new ObserveDealUC(
  mediaPlanRepository,
  clientRepository,
  campaignRepository,
  dealRepository
);
