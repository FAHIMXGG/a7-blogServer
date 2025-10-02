import { Request, Response } from 'express';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { createUser } from '../../services/user.service';

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['user', 'admin']).default('user'),
  // Bangladesh-style number: starts with 01 + 9 digits (11 total)
  phone: z.string().regex(/^01[0-9]{9}$/, 'Invalid phone number')
});

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, role, phone } = registerSchema.parse(req.body);

  const hashed = await bcrypt.hash(password, 10);
  const user = await createUser({ name, email, password: hashed, role, phone });

  return res.status(201).json({
    success: true,
    message: 'User registered successfully!',
    data: user
  });
};
