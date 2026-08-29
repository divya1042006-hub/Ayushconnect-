import express from 'express';
import cors from 'cors';
import apiRouter from './routes/api.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Allow all origins (open CORS for demo/hackathon deployment)
app.use(cors());
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
