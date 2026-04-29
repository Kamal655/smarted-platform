import Progress from '../models/Progress.js';

// @desc    Get all progress updates
// @route   GET /api/progress
// @access  Private
export const getProgress = async (req, res, next) => {
  try {
    const progress = await Progress.find({})
      .populate('student', 'name email')
      .populate('task', 'title status');
    res.json(progress);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a progress update
// @route   POST /api/progress
// @access  Private/Intern
export const createProgress = async (req, res, next) => {
  try {
    const { task, hoursWorked, notes, githubUrl } = req.body;

    const progress = new Progress({
      task,
      student: req.user._id,
      hoursWorked,
      notes,
      githubUrl,
    });

    const createdProgress = await progress.save();
    res.status(201).json(createdProgress);
  } catch (error) {
    res.status(400);
    next(error);
  }
};

// @desc    Get progress by ID
// @route   GET /api/progress/:id
// @access  Private
export const getProgressById = async (req, res, next) => {
  try {
    const progress = await Progress.findById(req.params.id)
      .populate('student', 'name email')
      .populate('task', 'title');

    if (progress) {
      res.json(progress);
    } else {
      res.status(404);
      throw new Error('Progress record not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update progress (or add mentor feedback)
// @route   PUT /api/progress/:id
// @access  Private
export const updateProgress = async (req, res, next) => {
  try {
    const { hoursWorked, notes, githubUrl, recruiterFeedback } = req.body;

    const progress = await Progress.findById(req.params.id);

    if (progress) {
      // Either student updating notes/hours or recruiter adding feedback
      if (hoursWorked !== undefined) progress.hoursWorked = hoursWorked;
      if (notes) progress.notes = notes;
      if (githubUrl) progress.githubUrl = githubUrl;
      if (recruiterFeedback) progress.recruiterFeedback = recruiterFeedback;

      const updatedProgress = await progress.save();
      res.json(updatedProgress);
    } else {
      res.status(404);
      throw new Error('Progress record not found');
    }
  } catch (error) {
    res.status(400);
    next(error);
  }
};

// @desc    Delete progress
// @route   DELETE /api/progress/:id
// @access  Private/Admin/Mentor
export const deleteProgress = async (req, res, next) => {
  try {
    const progress = await Progress.findByIdAndDelete(req.params.id);

    if (progress) {
      res.json({ message: 'Progress removed' });
    } else {
      res.status(404);
      throw new Error('Progress record not found');
    }
  } catch (error) {
    next(error);
  }
};
