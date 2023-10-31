import { isValidObjectId, Types } from 'mongoose';
import {
  Filter,
  MediaPlanListFilter,
  SortMediaPlansList,
  CHANNEL_MEDIA_PLAN_STATUS
} from '@skyrise-eng/types';
import { UpdateChannelBody, UpdateChannelMongoQuery } from '@domains/interfaces/models';

export const getMediaPlanListSearchQuery = (search: string) => {
  const searchKeys = ['campaign.name', 'client.lastName', 'client.firstName'];
  return { $or: searchKeys.map((key) => ({ [key]: { $regex: new RegExp(search, 'i') } })) };
};

export const parseObjectId = (id: string) => (isValidObjectId(id) ? new Types.ObjectId(id) : id);

export const getFilterQuery = (filter: Filter) => ({
  $and: Object.entries(filter).map(([key, value]) => ({ [key]: { $in: value.map(parseObjectId) } }))
});

export const mediaListFilterQueries = (filter: MediaPlanListFilter) => {
  const { channel, ...filterProps } = filter;
  return {
    matchFilter: Object.keys(filterProps).length ? getFilterQuery(filterProps) : {},
    matchChannels: channel ? { channels: { $in: channel } } : {}
  };
};

export const getSortMediaListQuery = (sort?: SortMediaPlansList) => {
  if (!sort) return '_id';
  if (sort === 'client') {
    return 'client.firstName';
  }
  if (sort === 'manager') return 'manager.email';
  return sort;
};

export const formUpdateChannelQuery = ({
  saveAsDraft,
  ...channel
}: UpdateChannelBody): UpdateChannelMongoQuery => {
  const query = Object.entries(channel).reduce<UpdateChannelMongoQuery>((acc, [key, val]) => {
    if (val === null) {
      acc.$unset = { ...acc.$unset, [key]: 1 };
    } else {
      acc.$set = { ...acc.$set, [key]: val };
    }
    return acc;
  }, {});

  if (saveAsDraft === true) {
    query.$set = { ...query.$set, status: CHANNEL_MEDIA_PLAN_STATUS.DRAFT };
  }
  if (saveAsDraft === false) {
    query.$set = { ...query.$set, status: CHANNEL_MEDIA_PLAN_STATUS.READY };
  }

  return query;
};

export const formInQuery = (query: { [key: string]: string | string[] }) =>
  Object.entries(query).reduce(
    (acc, [key, v]) => ({ ...acc, [key]: { $in: Array.isArray(v) ? v : [v] } }),
    {}
  );
