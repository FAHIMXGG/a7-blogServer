// src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  // Prisma unique constraint (e.g., duplicate email)
  if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
    const targets = (err.meta?.target as string[]) || ['field'];
    const field = targets.includes('email') ? 'email' : targets[0];
    return res.status(409).json({
      success: false,
      message: `Duplicate key error: ${field} already exists.`
    });
  }

  // Zod validation
  if (err?.name === 'ZodError') {
    const first = err.issues?.[0]?.message || 'Invalid input';
    return res.status(400).json({ success: false, message: first });
  }

  // Auth generic
  if (err?.name === 'UnauthorizedError') {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  console.error(err);
  return res.status(500).json({ success: false, message: 'Internal server error' });
};
