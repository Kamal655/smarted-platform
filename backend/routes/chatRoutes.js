import express from 'express';
import { processChat } from '../controllers/chatController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, authorize('student'), processChat);

export default router;
