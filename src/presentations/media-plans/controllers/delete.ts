import { MediaPlan } from '@skyrise-eng/types';
import { resToJson } from '@utils';
import { deleteMediaPlanUseCase } from '@src/domains';
import { UserAuth } from '@domains/interfaces/models';

type ResBody = {
  mediaPlan: MediaPlan;
  channels: number;
};

export const deleteMediaPlan = resToJson<{ planId: string }, ResBody, null, null, UserAuth>(({ params }) =>
  deleteMediaPlanUseCase.exec(params.planId)
);
