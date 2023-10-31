import { GetChannelsList } from '@domains/interfaces/use-cases';
import { ChannelRepo } from '@domains/interfaces/repositories';
import { ChannelListRequest } from '@domains/interfaces/models';

export class GetChannelListUC implements GetChannelsList {
  constructor(private channelRepository: ChannelRepo) {}

  exec(params: ChannelListRequest) {
    return this.channelRepository.getList(params);
  }
}
