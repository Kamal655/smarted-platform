import express from 'express';
import {
  getProgress,
  createProgress,
  getProgressById,
  updateProgress,
  deleteProgress,
} from '../controllers/progressController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getProgress)
  .post(protect, authorize('student', 'admin'), createProgress);

router.route('/:id')
  .get(protect, getProgressById)
  .put(protect, updateProgress) // allows students or recruiters depending on what is updated
  .delete(protect, authorize('admin', 'recruiter'), deleteProgress);

export default router;
