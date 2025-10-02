// api/index.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { app } from '../src/app';

// Express is a request handler already. We just delegate to it.
export default function handler(req: VercelRequest, res: VercelResponse) {
  return app(req, res);
}
