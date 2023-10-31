import { MediaPlanFlatten, Channel } from '@skyrise-eng/types';
import { PdfRepo } from '@domains/interfaces/repositories';
import { PdfSource } from '@data/interfaces/data-sources';

export class PdfRepository implements PdfRepo {
  constructor(protected Source: PdfSource) {}

  generateCampaignHtml(mediaPlan: MediaPlanFlatten<string>, channels: Channel[], isLastChunk: boolean) {
    return this.Source.generateCampaignHtml(mediaPlan, channels, isLastChunk);
  }
}
