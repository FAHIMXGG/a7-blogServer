// src/config/jwt.ts
import jwt, { Secret, SignOptions } from 'jsonwebtoken';

export const signJwt = (
  payload: object,
  expiresIn: SignOptions['expiresIn'] = (process.env.JWT_EXPIRES_IN ?? '7d') as SignOptions['expiresIn']
): string => {
  const secret = process.env.JWT_SECRET as Secret;
  if (!secret) throw new Error('JWT_SECRET is not set');

  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, secret, options);
};
