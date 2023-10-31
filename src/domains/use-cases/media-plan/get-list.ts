import { GetMediaPlanList } from '@domains/interfaces/use-cases';
import { MediaPlanRepo } from '@domains/interfaces/repositories';
import { MediaPlanListRequest } from '@domains/interfaces/models';

export class GetMediaPlanListUC implements GetMediaPlanList {
  constructor(private mediaPlanRepository: MediaPlanRepo) {}

  async exec(params: MediaPlanListRequest) {
    return this.mediaPlanRepository.getList(params);
  }
}
