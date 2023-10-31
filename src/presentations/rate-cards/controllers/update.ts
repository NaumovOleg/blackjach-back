import { RateCard } from '@skyrise-eng/types';
import { resToJson } from '@utils';
import { UserAuth } from '@domains/interfaces/models';
import { updateRateCardUseCase } from '@src/domains';

export const updateRateCard = resToJson<{ rateCardId: string }, RateCard, RateCard, null, UserAuth>(
  ({ body, params }) => updateRateCardUseCase.exec(params.rateCardId, body)
);
