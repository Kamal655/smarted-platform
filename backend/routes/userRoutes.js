import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getStats,
  updateUserProfile
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', protect, authorize('admin'), getStats);
router.route('/').get(protect, authorize('admin', 'recruiter'), getUsers);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route('/:id')
  .get(protect, authorize('admin', 'recruiter'), getUserById)
  .put(protect, authorize('admin'), updateUser)
  .delete(protect, authorize('admin'), deleteUser);

export default router;
