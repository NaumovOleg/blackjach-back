import { Application } from 'express';

export interface IMount {
  mount: (app: Application) => Application;
}
