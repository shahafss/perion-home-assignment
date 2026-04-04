import 'dotenv/config';
import express from 'express';
import authRoutes from './routes/authRoutes';
import dashboardRoutes from './routes/dashboardRoutes';

export const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});
