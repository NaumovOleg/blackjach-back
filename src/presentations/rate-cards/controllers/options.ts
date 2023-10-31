import { RateCardOptions, RateCardOptionsQuery } from '@skyrise-eng/types';
import { resToJson } from '@utils';
import { UserAuth } from '@domains/interfaces/models';
import { getRateCardOptionsUseCase } from '@src/domains';

export const getRateCardOptions = resToJson<{}, RateCardOptions, null, RateCardOptionsQuery, UserAuth>(
  ({ query }) => getRateCardOptionsUseCase.exec(query)
);
