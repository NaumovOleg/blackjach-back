import { Request, Response, NextFunction } from 'express';

type UserLocal<T> = { user: T };

type Handler<P, ResB, ReqB, Q, L> = (
  req: Request<P, ResB, ReqB, Q, UserLocal<L>>,
  res: Response<ResB, UserLocal<L>>,
  next: NextFunction
) => Promise<ResB>;

type Local = Record<string, any> | undefined;

export const resToJson =
  <P, ResB, ReqB, Q, L extends Local = undefined>(action: Handler<P, ResB, ReqB, Q, L>) =>
  (req: Request<P, ResB, ReqB, Q, UserLocal<L>>, res: Response<ResB, UserLocal<L>>, next: NextFunction) =>
    Promise.resolve(action(req, res, next))
      .then((data) => res.json(data))
      .catch((err) => {
        next(err);
      });
