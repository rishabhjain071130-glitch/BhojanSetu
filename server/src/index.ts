import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { ENV, validateEnv } from './config/env.js';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/error.js';

// Route imports
import healthRoutes from './routes/health.routes.js';
import authRoutes from './routes/auth.routes.js';
import listingsRoutes from './routes/listings.routes.js';
import requestsRoutes from './routes/requests.routes.js';
import partnersRoutes from './routes/partners.routes.js';
import impactRoutes from './routes/impact.routes.js';

validateEnv();

const app = express();

// Security headers
app.use(helmet());

// Cross-Origin Resource Sharing
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow localhost and configured client origin
      if (!origin || origin.startsWith('http://localhost') || origin === ENV.CLIENT_ORIGIN) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev, or origin check
      }
    },
    credentials: true,
  })
);

// Body parsing with reasonable limits
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Auth rate limiting to prevent brute force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many authentication attempts. Please try again after 15 minutes.',
  },
});

// Mount Routes
app.use('/api', healthRoutes);
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/listings', listingsRoutes);
app.use('/api', requestsRoutes); // mounts /api/listings/:id/requests, /api/requests/mine, /api/requests/:id/decision, /api/requests/:id/status
app.use('/api/partners', partnersRoutes);
app.use('/api/impact', impactRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `API route '${req.method} ${req.originalUrl}' not found.`,
  });
});

// Central Error Handler
app.use(errorHandler);

// Start server
async function startServer() {
  try {
    await connectDB();
    const server = app.listen(ENV.PORT, () => {
      console.log(`🚀 BhojanSetu Server is listening on http://localhost:${ENV.PORT}`);
      console.log(`📋 API Health Check: http://localhost:${ENV.PORT}/api/health`);
    });

    const shutdown = async () => {
      console.log('\n🛑 Gracefully shutting down server...');
      server.close(() => {
        console.log('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    console.error('Fatal startup error:', error);
    process.exit(1);
  }
}

startServer();

export default app;
