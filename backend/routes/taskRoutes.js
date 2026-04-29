import express from 'express';
import {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getTasks)
  .post(protect, authorize('admin', 'recruiter'), createTask);

router.route('/:id')
  .get(protect, getTaskById)
  .put(protect, authorize('admin', 'recruiter', 'student'), updateTask)
  .delete(protect, authorize('admin', 'recruiter'), deleteTask);

export default router;
