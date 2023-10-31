import { resToJson } from '@utils';
import HttpError from 'http-errors';

type Query = { search: string };
type ReqBody = { name: string };
type ResBody = { [key: string]: string };
type Parameters = { id: string };

export const createLibrary = resToJson<Parameters, ResBody, ReqBody, Query>(async () => {
  throw HttpError(401, { statusCode: 405, status: 500 });
});
