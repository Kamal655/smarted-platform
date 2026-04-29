import express from 'express';
import multer from 'multer';
import { analyzeResume, getResumeProfile, parseResumeOnly } from '../controllers/resumeController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Use memory storage - we never write the file to disk
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB max
  },
});

// POST /api/resume/analyze - student uploads resume for analysis
router.post(
  '/analyze',
  protect,
  authorize('student'),
  upload.single('resume'),
  analyzeResume
);

// GET /api/resume/profile - fetch previously analyzed profile
router.get(
  '/profile',
  protect,
  authorize('student'),
  getResumeProfile
);

// POST /api/resume/parse-only - parses and returns without saving
router.post(
  '/parse-only',
  protect,
  authorize('student'),
  upload.single('resume'),
  parseResumeOnly
);

export default router;
