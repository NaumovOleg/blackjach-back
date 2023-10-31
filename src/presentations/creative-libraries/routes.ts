import { Router } from 'express';
import { join } from 'path';
import { middleware } from 'express-openapi-validator';
import { getLibrary, createLibrary } from './controllers';

const apiSpec = join(__dirname, './library-open-api.json');

const apiRouter = Router().get('/:id', getLibrary).post('/', createLibrary);

const router = Router().use(middleware({ apiSpec })).use('/v1', apiRouter);

export { router };
