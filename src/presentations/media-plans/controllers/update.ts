import { MediaPlan, UpdateMediaPlanRequest } from '@skyrise-eng/types';
import moment from 'moment';
import { resToJson } from '@utils';
import { UserAuth } from '@domains/interfaces/models';
import { updateMediaPlanUseCase, refreshBatchMargins, refreshMediaPlanUseCase } from '@src/domains';

type Parameters = { planId: string };

export const updateMediaPlan = resToJson<Parameters, MediaPlan, UpdateMediaPlanRequest, null, UserAuth>(
  async ({ body, params }) => {
    const mediaPlan = await updateMediaPlanUseCase.exec(params.planId, {
      ...body,
      startDate: moment(body.startDate).toDate(),
      endDate: moment(body.endDate).toDate(),
      scheduleDate: moment(body.scheduleDate).toDate(),
      agencyDiscount: body.agencyDiscount ? 15 : 0
    });

    await refreshBatchMargins.exec(mediaPlan);
    const updatedMediaPlan = await refreshMediaPlanUseCase.exec(mediaPlan._id);

    return updatedMediaPlan ?? mediaPlan;
  }
);
