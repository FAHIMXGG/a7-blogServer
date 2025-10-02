import { app } from '../src/app';

// Export a function handler that delegates to the Express app
export default function handler(req: any, res: any) {
  return (app as any)(req, res);
}


