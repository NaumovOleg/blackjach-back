import { RateCard } from '@skyrise-eng/types';
import { resToJson } from '@utils';
import { UserAuth } from '@domains/interfaces/models';
import { createRateCardUseCase } from '@src/domains';

export const createRateCard = resToJson<{}, RateCard, RateCard, null, UserAuth>(({ body }) =>
  createRateCardUseCase.exec(body)
);
