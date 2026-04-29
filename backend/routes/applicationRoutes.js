import express from 'express';
import {
  applyForInternship,
  getMyApplications,
  getInternshipApplications,
  updateApplicationStatus,
  getAllApplications,
} from '../controllers/applicationController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, authorize('admin'), getAllApplications)
  .post(protect, authorize('student'), applyForInternship);

router.get('/my-applications', protect, authorize('student'), getMyApplications);

router.get('/internship/:id', protect, authorize('recruiter', 'admin'), getInternshipApplications);

router.route('/:id')
  .put(protect, authorize('recruiter', 'admin'), updateApplicationStatus);

export default router;
