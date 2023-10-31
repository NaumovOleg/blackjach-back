import { config } from 'node-config-ts';
import { Unauthorized } from 'http-errors';
import { NextFunction, Request, Response } from 'express';

export const authenticatePipedriveWebhook = ({ headers }: Request, _: Response, next: NextFunction) => {
  if (!headers.authorization) {
    throw new Unauthorized('Username and  password  required');
  }
  const base64Credentials = headers.authorization.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');

  if (
    username !== config.PipeDriveWebhookAuth.username ||
    password !== config.PipeDriveWebhookAuth.password
  ) {
    return next(Unauthorized('Invalid credentials'));
  }
  return next();
};
