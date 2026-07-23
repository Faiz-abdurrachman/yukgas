import express from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public Routes
router.post('/register', register);
router.post('/login', login);

// Protected Routes
router.get('/me', authMiddleware, getMe);

export default router;
