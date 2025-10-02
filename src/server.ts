import 'dotenv/config';
import http from 'http';
import { app } from './app';

const PORT = process.env.PORT || 5000;

http.createServer(app).listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
