import { CreateMediaPlanRequest, MediaPlan, UpdateMediaPlanRequest } from '@skyrise-eng/types';
import { MediaPlanListRequest } from '@domains/interfaces/models';
import { MediaPlanSource } from '@data/interfaces/data-sources';
import { MediaPlanCoreWrapper } from '@data/interfaces/wrappers';
import { Source } from '@utils';

export class MediaPlanDataSource
  extends Source<MediaPlan, CreateMediaPlanRequest, UpdateMediaPlanRequest>
  implements MediaPlanSource
{
  protected Core: MediaPlanCoreWrapper;

  getList(params: MediaPlanListRequest) {
    return this.Core.getList(params);
  }

  find(mediaPlanId: string) {
    return this.Core.findByIdWithPopulate(mediaPlanId);
  }
}
