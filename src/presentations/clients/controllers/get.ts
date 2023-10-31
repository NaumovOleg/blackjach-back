import { Client } from '@skyrise-eng/types';
import { resToJson } from '@utils';
import { UserAuth } from '@domains/interfaces/models';
import { getClientListUseCase } from '@src/domains';

export const getClientList = resToJson<{}, Client[], any, any, UserAuth>(() => getClientListUseCase.exec());
