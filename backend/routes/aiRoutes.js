import express from 'express';
import { 
  getCareerRoadmap, 
  getInterviewPrep, 
  getCandidateSummary,
  getMatchScore,
  postLiveInterview
} from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Student Routes
router.get('/roadmap/:internshipId', protect, getCareerRoadmap);
router.get('/interview-prep/:internshipId', protect, getInterviewPrep);
router.get('/match/:internshipId', protect, getMatchScore);
router.post('/live-interview/:internshipId', protect, postLiveInterview);

// Recruiter Routes
router.get('/candidate-summary/:studentId/:internshipId', protect, getCandidateSummary);

export default router;
