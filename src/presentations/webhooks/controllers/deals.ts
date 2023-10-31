import { resToJson } from '@utils';
import { PipedriveWebhookPayload, WebhookResponse } from '@domains/interfaces/models';
import { observeDealUseCase } from '@src/domains';

export const observeDeal = resToJson<{}, WebhookResponse | null, PipedriveWebhookPayload, any>(
  async ({ body }) => (body.meta.object === 'deal' ? observeDealUseCase.exec(body) : null)
);
