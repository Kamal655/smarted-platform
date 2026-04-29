import express from 'express';
import {
  getInternships,
  createInternship,
  getInternshipById,
  updateInternship,
  deleteInternship,
  getMyPostings,
  getRecommendations
} from '../controllers/internshipController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getInternships)
  .post(protect, authorize('admin', 'recruiter'), createInternship);

router.get('/my-postings', protect, authorize('recruiter'), getMyPostings);

// ⚠️  /recommend MUST be declared before /:id — otherwise 'recommend' is parsed as an ObjectId
router.get('/recommend', protect, authorize('student'), getRecommendations);

router.route('/:id')
  .get(getInternshipById)
  .put(protect, authorize('admin', 'recruiter'), updateInternship)
  .delete(protect, authorize('admin', 'recruiter'), deleteInternship);

export default router;
