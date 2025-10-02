// src/config/prisma.ts
import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

// In serverless, new client per invocation is fine, but we reuse if present (local dev)
export const prisma =
  global.__prisma ??
  new PrismaClient({
    log: ['warn', 'error']
  });

if (!global.__prisma) global.__prisma = prisma;
