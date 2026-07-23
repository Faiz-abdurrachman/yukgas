import express from 'express';
import { submitRating, getUserRatings } from '../controllers/ratingController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public: view user's ratings
router.get('/user/:userId', getUserRatings);

// Protected: submit rating for quest
router.post('/:questId', authMiddleware, submitRating);

export default router;
