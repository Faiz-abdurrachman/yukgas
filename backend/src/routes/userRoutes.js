import express from 'express';
import {
  getUserProfile,
  updateProfile,
  getMyQuestsGiven,
  getMyQuestsTaken
} from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Protected profile updates
router.put('/profile', authMiddleware, updateProfile);

// Protected quest history (must be defined before /:id wildcard)
router.get('/quests/given', authMiddleware, getMyQuestsGiven);
router.get('/quests/taken', authMiddleware, getMyQuestsTaken);

// Public: view user profiles by ID
router.get('/:id', getUserProfile);

export default router;
