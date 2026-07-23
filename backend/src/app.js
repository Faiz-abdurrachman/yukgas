import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import questRoutes from './routes/questRoutes.js';
import userRoutes from './routes/userRoutes.js';
import ratingRoutes from './routes/ratingRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate Limiter
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api', limiter);

// Parsing Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/quests', questRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/ratings', ratingRoutes);
app.use('/api/v1/notifications', notificationRoutes);

// Basic Health Check Route
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'YUKgas.in API is running smoothly',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`  YUKgas.in Backend Server Started`);
  console.log(`  Port   : ${PORT}`);
  console.log(`  Mode   : ${process.env.NODE_ENV || 'development'}`);
  console.log(`  Health : http://localhost:${PORT}/api/v1/health`);
  console.log(`=========================================`);
});

export default app;
