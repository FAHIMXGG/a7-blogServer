import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'express-async-errors';
import blogRoutes from './modules/blog/blog.routes';

import { errorHandler } from './middlewares/errorHandler';
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/user/user.routes';

export const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: true, // set to your FE origin in production
    credentials: true
  })
);

app.get('/blogs', (_req, res) => res.json({ ok: true }));

const apiPrefix = process.env.API_PREFIX ?? '/api';

app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/users`, userRoutes);
app.use(`${apiPrefix}/blogs`, blogRoutes);

app.use(errorHandler);
