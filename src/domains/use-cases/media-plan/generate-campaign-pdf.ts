import { PdfRepo, MediaPlanRepo, ChannelRepo } from '@domains/interfaces/repositories';
import { GenerateCampaignPdf } from '@domains/interfaces/use-cases';
import { splitByChunks } from '@utils';
import { Channel } from '@skyrise-eng/types';

export class GenerateCampaignPdfUC implements GenerateCampaignPdf {
  constructor(
    private pdfRepository: PdfRepo,
    private mediaPlanRepository: MediaPlanRepo,
    private channelRepository: ChannelRepo
  ) {}

  async exec(mediaPlanId: string) {
    const [mediaPlan, channels] = await Promise.all([
      this.mediaPlanRepository.find(mediaPlanId),
      this.channelRepository.getManyByMediaId(mediaPlanId)
    ]);

    return Promise.all(
      splitByChunks<Channel>(channels, 8).map((chunk, index, chunks) =>
        this.pdfRepository.generateCampaignHtml(mediaPlan, chunk, chunks.length - 1 === index)
      )
    );
  }
}
