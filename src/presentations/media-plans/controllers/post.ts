import { MediaPlan, CreateMediaPlanRequest } from '@skyrise-eng/types';
import { resToJson } from '@utils';
import { UserAuth } from '@domains/interfaces/models';
import { createMediaPlanUseCase } from '@src/domains';

type ReqBody = Omit<CreateMediaPlanRequest, 'manager' | 'agencyDiscount'> & {
  agencyDiscount: boolean;
};

export const createMediaPlan = resToJson<{}, MediaPlan, ReqBody, null, UserAuth>(({ body }, { locals }) =>
  createMediaPlanUseCase.exec({
    ...body,
    manager: locals.user._id,
    agencyDiscount: body.agencyDiscount ? 15 : 0
  })
);
