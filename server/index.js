import express from 'express';
import cors from 'cors';
import apiRouter from './routes/api.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Allow requests from the Vercel frontend (set ALLOWED_ORIGIN in Render env vars)
const allowedOrigins = process.env.ALLOWED_ORIGIN
  ? [process.env.ALLOWED_ORIGIN, 'http://localhost:3000']
  : true; // Allow all origins in dev / before ALLOWED_ORIGIN is set

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());

// Root route — friendly status page
app.get('/', (req, res) => {
  res.json({
    service: 'AyushConnect Backend API',
    status: 'running',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api/*',
    },
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'AyushConnect Backend API', timestamp: new Date().toISOString() });
});

// API Router
app.use('/api', apiRouter);

app.listen(PORT, () => {
  console.log(`[AyushConnect Backend] Server running on http://localhost:${PORT}`);
});
