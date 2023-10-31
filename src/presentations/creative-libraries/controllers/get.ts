import { resToJson } from '@utils';

type Query = { search: string };
type ResBody = { [key: string]: string };
type Parameters = { id: string };

export const getLibrary = resToJson<Parameters, ResBody, null, Query>(async (req) => ({
  search: req.query.search,
  id: req.params.id
}));
