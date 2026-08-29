import express from 'express';
import cors from 'cors';
import apiRouter from './routes/api.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
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
