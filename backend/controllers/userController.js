import User from '../models/User.js';
import Internship from '../models/Internship.js';
import Application from '../models/Application.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'student',
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        avatar: user.avatar,
        bio: user.bio,
        location: user.location,
        github: user.github,
        linkedin: user.linkedin,
        portfolio: user.portfolio,
        phone: user.phone,
        collegeName: user.collegeName,
        degree: user.degree,
        branch: user.branch,
        graduationYear: user.graduationYear,
        cgpa: user.cgpa,
        dob: user.dob,
        gender: user.gender,
        address: user.address,
        hobbies: user.hobbies,
        languages: user.languages,
        certifications: user.certifications,
        skills: user.skills,
        experience: user.experience,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        avatar: user.avatar,
        bio: user.bio,
        location: user.location,
        github: user.github,
        linkedin: user.linkedin,
        portfolio: user.portfolio,
        phone: user.phone,
        collegeName: user.collegeName,
        degree: user.degree,
        branch: user.branch,
        graduationYear: user.graduationYear,
        cgpa: user.cgpa,
        dob: user.dob,
        gender: user.gender,
        address: user.address,
        hobbies: user.hobbies,
        languages: user.languages,
        certifications: user.certifications,
        skills: user.skills,
        experience: user.experience,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        avatar: user.avatar,
        bio: user.bio,
        location: user.location,
        github: user.github,
        linkedin: user.linkedin,
        portfolio: user.portfolio,
        phone: user.phone,
        collegeName: user.collegeName,
        degree: user.degree,
        branch: user.branch,
        graduationYear: user.graduationYear,
        cgpa: user.cgpa,
        dob: user.dob,
        gender: user.gender,
        address: user.address,
        hobbies: user.hobbies,
        languages: user.languages,
        certifications: user.certifications,
        skills: user.skills,
        experience: user.experience,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res, next) => {
  try {
    const query = req.user.role === 'recruiter' ? { role: 'student' } : {};
    const users = await User.find(query).select('-password');
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.role = req.body.role || user.role;

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile data (Student driven)
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      if (req.body.avatar !== undefined) user.avatar = req.body.avatar;
      if (req.body.bio !== undefined) user.bio = req.body.bio;
      if (req.body.location !== undefined) user.location = req.body.location;
      if (req.body.github !== undefined) user.github = req.body.github;
      if (req.body.linkedin !== undefined) user.linkedin = req.body.linkedin;
      if (req.body.portfolio !== undefined) user.portfolio = req.body.portfolio;
      if (req.body.phone !== undefined) user.phone = req.body.phone;
      if (req.body.collegeName !== undefined) user.collegeName = req.body.collegeName;
      if (req.body.degree !== undefined) user.degree = req.body.degree;
      if (req.body.branch !== undefined) user.branch = req.body.branch;
      if (req.body.graduationYear !== undefined) user.graduationYear = req.body.graduationYear;
      if (req.body.cgpa !== undefined) user.cgpa = req.body.cgpa;
      if (req.body.dob !== undefined) user.dob = req.body.dob;
      if (req.body.gender !== undefined) user.gender = req.body.gender;
      if (req.body.address !== undefined) user.address = req.body.address;
      if (req.body.hobbies !== undefined) user.hobbies = req.body.hobbies;
      if (req.body.languages !== undefined) user.languages = req.body.languages;
      if (req.body.certifications !== undefined) user.certifications = req.body.certifications;
      if (req.body.skills !== undefined) user.skills = req.body.skills;
      if (req.body.experience !== undefined) user.experience = req.body.experience;

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        createdAt: updatedUser.createdAt,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio,
        location: updatedUser.location,
        github: updatedUser.github,
        linkedin: updatedUser.linkedin,
        portfolio: updatedUser.portfolio,
        phone: updatedUser.phone,
        collegeName: updatedUser.collegeName,
        degree: updatedUser.degree,
        branch: updatedUser.branch,
        graduationYear: updatedUser.graduationYear,
        cgpa: updatedUser.cgpa,
        dob: updatedUser.dob,
        gender: updatedUser.gender,
        address: updatedUser.address,
        hobbies: updatedUser.hobbies,
        languages: updatedUser.languages,
        certifications: updatedUser.certifications,
        skills: updatedUser.skills,
        experience: updatedUser.experience,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (user) {
      res.json({ message: 'User removed' });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};
// @desc    Get dashboard stats
// @route   GET /api/users/stats
// @access  Private/Admin
export const getStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const students = await User.countDocuments({ role: 'student' });
    const recruiters = await User.countDocuments({ role: 'recruiter' });
    const totalInternships = await Internship.countDocuments();
    const totalApplications = await Application.countDocuments();

    res.json({
      totalUsers,
      students,
      recruiters,
      totalInternships,
      totalApplications,
    });
  } catch (error) {
    next(error);
  }
};
