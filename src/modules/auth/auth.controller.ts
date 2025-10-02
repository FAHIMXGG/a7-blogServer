import { Request, Response } from 'express';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { findUserByEmail } from '../../services/user.service';
import { signJwt } from '../../config/jwt';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required')
});

export const login = async (req: Request, res: Response) => {
  const { email, password } = loginSchema.parse(req.body);

  const user = await findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const token = signJwt({ sub: user.id, role: user.role });

  // httpOnly cookie
  res.cookie('accessToken', token, {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  // shape user like Mongo: remove password, map id -> _id, add __v:0
  const { password: _pw, id, ...rest } = user;
  const safeUser = { ...rest, _id: id, __v: 0 };

  return res.json({
    success: true,
    message: 'User logged in successfully!',
    data: { user: safeUser }
  });
};
