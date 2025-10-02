import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export type AuthUser = {
  sub: string; // user id
  role: 'user' | 'admin';
};

declare global {
  namespace Express {
    interface Request {
      auth?: AuthUser;
    }
  }
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
  // read from cookie or Authorization: Bearer
  const bearer = req.headers.authorization?.split(' ')[1];
  const token = req.cookies?.accessToken || bearer;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    // expect we signed { sub, role }
    req.auth = { sub: decoded.sub as string, role: decoded.role as 'user' | 'admin' };
    return next();
  } catch {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.auth?.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Forbidden: admin only' });
  }
  next();
};
