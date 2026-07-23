import express from 'express';
import {
  createQuest,
  getQuestFeed,
  getQuestDetail,
  updateQuest,
  cancelQuest,
  takeQuest,
  startQuest,
  completeQuest,
  cancelTake,
  confirmPayment
} from '../controllers/questController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public feed and details
router.get('/', getQuestFeed);
router.get('/:id', getQuestDetail);

// Protected actions
router.post('/', authMiddleware, createQuest);
router.put('/:id', authMiddleware, updateQuest);
router.delete('/:id', authMiddleware, cancelQuest);

// Quest workflow states
router.post('/:id/take', authMiddleware, takeQuest);
router.post('/:id/start', authMiddleware, startQuest);
router.post('/:id/complete', authMiddleware, completeQuest);
router.post('/:id/release', authMiddleware, cancelTake);
router.post('/:id/pay', authMiddleware, confirmPayment);

export default router;
