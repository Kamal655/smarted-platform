import Application from '../models/Application.js';
import Internship from '../models/Internship.js';
import { createNotification } from './notificationController.js';

// @desc    Apply for an internship
// @route   POST /api/applications
// @access  Private (Student)
export const applyForInternship = async (req, res, next) => {
  try {
    const { internshipId, resume, coverLetter } = req.body;

    // Check if internship exists
    const internship = await Internship.findById(internshipId);
    if (!internship) {
      res.status(404);
      throw new Error('Internship not found');
    }

    // Check if user already applied
    const alreadyApplied = await Application.findOne({
      student: req.user._id,
      internship: internshipId,
    });

    if (alreadyApplied) {
      res.status(400);
      throw new Error('You have already applied for this internship');
    }

    const application = await Application.create({
      student: req.user._id,
      internship: internshipId,
      resume,
      coverLetter,
    });

    // Notify Recruiter
    await createNotification(
      internship.postedBy,
      `${req.user.name} applied for your posting: ${internship.title}`,
      'info'
    );

    res.status(201).json(application);
  } catch (error) {
    next(error);
  }
};

// @desc    Get student's applications
// @route   GET /api/applications/my-applications
// @access  Private (Student)
export const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ student: req.user._id })
      .populate('internship', 'title company location stipend');
    res.json(applications);
  } catch (error) {
    next(error);
  }
};

// @desc    Get applications for an internship (for recruiter)
// @route   GET /api/applications/internship/:id
// @access  Private (Recruiter)
export const getInternshipApplications = async (req, res, next) => {
  try {
    const internship = await Internship.findById(req.params.id);
    
    if (!internship) {
      res.status(404);
      throw new Error('Internship not found');
    }

    // Check if recruiter posted this internship
    if (internship.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to view these applications');
    }

    const applications = await Application.find({ internship: req.params.id })
      .populate('student', 'name email');
    res.json(applications);
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id
// @access  Private (Recruiter/Admin)
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id).populate('internship');

    if (!application) {
      res.status(404);
      throw new Error('Application not found');
    }

    // Check authorization
    if (application.internship.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to update this application');
    }

    application.status = status;
    const updatedApplication = await application.save();

    // Notify Student
    const statusType = status === 'Accepted' ? 'success' : status === 'Rejected' ? 'error' : 'info';
    await createNotification(
      application.student,
      `Your application for ${application.internship.title} is now ${status}`,
      statusType,
      `/applications`
    );

    // Emit live WebSocket notification
    if (global.io && global.connectedUsers) {
      const socketId = global.connectedUsers.get(application.student.toString());
      if (socketId) {
        global.io.to(socketId).emit('notification', {
           message: `Your application for ${application.internship.title} is now ${status}`,
           type: statusType
        });
      }
    }

    res.json(updatedApplication);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications (Admin only)
// @route   GET /api/applications
// @access  Private/Admin
export const getAllApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({})
      .populate('student', 'name email')
      .populate('internship', 'title company');
    res.json(applications);
  } catch (error) {
    next(error);
  }
};
