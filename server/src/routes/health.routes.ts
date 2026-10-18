import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';

const router = Router();

router.get('/health', (req: Request, res: Response) => {
  const isDbConnected = mongoose.connection.readyState === 1;

  res.json({
    status: isDbConnected ? 'healthy' : 'degraded',
    service: 'BhojanSetu Express API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: {
      connected: isDbConnected,
      name: mongoose.connection.name || 'bhojansetu',
    },
    uptimeSeconds: Math.floor(process.uptime()),
  });
});

export default router;
