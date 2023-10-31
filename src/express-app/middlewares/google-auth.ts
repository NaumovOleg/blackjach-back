import admin, { ServiceAccount } from 'firebase-admin';
import { USER_ROLE } from '@skyrise-eng/types';
import { config } from 'node-config-ts';
import { Unauthorized } from 'http-errors';
import { NextFunction, Request, Response } from 'express';
import { UserAuth } from '@domains/interfaces/models';
import { getUserUseCase } from '@src/domains';

const { FIREBASE_CONFIG } = config;

const credential: ServiceAccount = {
  clientEmail: FIREBASE_CONFIG.client_email,
  projectId: FIREBASE_CONFIG.project_id,
  privateKey: FIREBASE_CONFIG.private_key
};

const firebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert(credential)
});

const retrieveUser = async (token: string): Promise<UserAuth> => {
  const tokenData = await firebaseAdmin.auth().verifyIdToken(token);

  if (!tokenData.email) {
    throw Unauthorized('Invalid email');
  }
  const user = await getUserUseCase.exec(tokenData.email);
  if (!user) {
    throw Unauthorized(`Error! The user doesn’t exist on the database.`);
  }
  return { email: user.email, role: user.role, _id: user._id };
};

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return next(Unauthorized('Token not provided'));
  }
  const token = authorization.split(' ')[1];
  try {
    const user = await retrieveUser(token);

    res.locals.user = user;
    return next();
  } catch (err: any) {
    return next(Unauthorized(err.code ?? err.message));
  }
};

type Role = keyof typeof USER_ROLE;
export const authWithRoles = (...roles: Role[]) => {
  const validateRoles = async (_: Request, res: Response<any>, next: NextFunction) => {
    if (!roles.includes(res.locals.user.role)) {
      return next(Unauthorized('Not permitted'));
    }
    return next();
  };

  return [authenticate, validateRoles];
};
