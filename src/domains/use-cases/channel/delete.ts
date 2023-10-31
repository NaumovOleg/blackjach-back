import { DeleteChannel } from '@domains/interfaces/use-cases';
import { ChannelRepo } from '@domains/interfaces/repositories';

export class DeleteChannelUC implements DeleteChannel {
  constructor(private channelRepository: ChannelRepo) {}

  async exec(channelId: string) {
    return this.channelRepository.delete(channelId);
  }
}
