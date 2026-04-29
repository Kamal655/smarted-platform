import Internship from '../models/Internship.js';
import Application from '../models/Application.js';
import User from '../models/User.js';
import { rankInternships } from '../utils/recommendationEngine.js';

// @desc    Get all internships (with search and filter)
// @route   GET /api/internships
// @access  Public
export const getInternships = async (req, res, next) => {
  try {
    const { keyword, location } = req.query;
    
    const query = {};
    if (keyword) {
      query.title = { $regex: keyword, $options: 'i' };
    }
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    query.status = 'Open';

    const internships = await Internship.find(query).sort({ createdAt: -1 });
    res.status(200).json(internships);
  } catch (error) {
    next(error);
  }
};

// @desc    Get internships posted by logged in recruiter
// @route   GET /api/internships/my-postings
// @access  Private (Recruiter)
export const getMyPostings = async (req, res, next) => {
  try {
    const internships = await Internship.find({ postedBy: req.user._id });
    res.json(internships);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new internship
// @route   POST /api/internships
// @access  Private (Recruiter/Admin)
export const createInternship = async (req, res, next) => {
  try {
    const { title, company, location, description, stipend } = req.body;
    
    const internship = await Internship.create({
      title,
      company,
      location,
      description,
      stipend,
      postedBy: req.user._id
    });
    
    res.status(201).json(internship);
  } catch (error) {
    res.status(400);
    next(error);
  }
};

// @desc    Get a single internship
// @route   GET /api/internships/:id
// @access  Public
export const getInternshipById = async (req, res, next) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (internship) {
      res.status(200).json(internship);
    } else {
      res.status(404);
      throw new Error('Internship not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update an internship
// @route   PUT /api/internships/:id
// @access  Public
export const updateInternship = async (req, res, next) => {
  try {
    const internship = await Internship.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (internship) {
      res.status(200).json(internship);
    } else {
      res.status(404);
      throw new Error('Internship not found');
    }
  } catch (error) {
    res.status(400);
    next(error);
  }
};

// @desc    Delete an internship
// @route   DELETE /api/internships/:id
// @access  Public
export const deleteInternship = async (req, res, next) => {
  try {
    const internship = await Internship.findByIdAndDelete(req.params.id);
    if (internship) {
      res.status(200).json({ message: 'Internship removed' });
    } else {
      res.status(404);
      throw new Error('Internship not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get personalised recommendations for the logged-in student
// @route   GET /api/internships/recommend
// @access  Private (Student)
export const getRecommendations = async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 6, 20);

    // 1. Fetch student profile (skills + education from resume analysis)
    const student = await User.findById(req.user._id).select('skills keywords education');
    const studentSkills = student?.skills || [];
    const studentKeywords = student?.keywords || [];

    // 2. Fetch applied internship descriptions to seed preference signals
    const applications = await Application.find({ student: req.user._id })
      .populate('internship', 'title description')
      .lean();

    const appliedIds = applications.map((a) => a.internship?._id?.toString()).filter(Boolean);
    const appliedDescriptions = applications
      .map((a) => `${a.internship?.title || ''} ${a.internship?.description || ''}`)
      .filter((d) => d.trim().length > 0);

    // 3. Fetch all open internships (excluding already applied)
    const allInternships = await Internship.find({ status: 'Open' }).lean();
    const candidates = allInternships.filter(
      (i) => !appliedIds.includes(i._id.toString())
    );

    if (!candidates.length) {
      return res.json({
        recommendations: [],
        meta: { totalCandidates: 0, profileStrength: 0, hasResumeData: false },
      });
    }

    // 4. Run ranking engine
    const ranked = rankInternships(
      { skills: [...studentSkills, ...studentKeywords], appliedDescriptions },
      candidates,
      limit
    );

    // 5. Profile strength: how much data do we have to work with
    const profileStrength = Math.min(
      Math.round((studentSkills.length / 15) * 100),
      100
    );

    res.json({
      recommendations: ranked.map(({ internship, relevanceScore, matchLabel }) => ({
        ...internship,
        relevanceScore,
        matchLabel,
      })),
      meta: {
        totalCandidates: candidates.length,
        profileStrength,
        hasResumeData: studentSkills.length > 0,
        appliedCount: appliedIds.length,
      },
    });
  } catch (error) {
    next(error);
  }
};
