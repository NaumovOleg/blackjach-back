import { RateCard } from '@skyrise-eng/types';
import { resToJson } from '@utils';
import { UserAuth } from '@domains/interfaces/models';
import { deleteRateCardUseCase } from '@src/domains';

export const deleteRateCard = resToJson<{ rateCardId: string }, RateCard, null, null, UserAuth>(
  ({ params }) => deleteRateCardUseCase.exec(params.rateCardId)
);
