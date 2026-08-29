import express from 'express';
import cors from 'cors';
import apiRouter from './routes/api.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Allow requests from the Vercel frontend (set ALLOWED_ORIGIN in Render env vars)
const allowedOrigins = process.env.ALLOWED_ORIGIN
  ? [process.env.ALLOWED_ORIGIN, 'http://localhost:3000']
  : ['http://localhost:3000'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());

// API Router
app.use('/api', apiRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'AyushConnect Backend API', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`[AyushConnect Backend] Server running on http://localhost:${PORT}`);
});
