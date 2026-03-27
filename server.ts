import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { connectDB } from './src/backend/config/db';
import authRoutes from './src/backend/routes/authRoutes';
import bookRoutes from './src/backend/routes/bookRoutes';
import { requestLogger } from './src/backend/middleware/logger';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Connect to Database
  await connectDB();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(requestLogger);

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/books', bookRoutes);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', database: 'connected' });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
