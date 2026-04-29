import Task from '../models/Task.js';
import { createNotification } from './notificationController.js';

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({}).populate('assignedTo', 'name email').populate('assignedBy', 'name email').populate('internship', 'title');
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private/Admin/Recruiter
export const createTask = async (req, res, next) => {
  try {
    const { title, description, internship, assignedTo, dueDate } = req.body;

    const task = new Task({
      title,
      description,
      internship,
      assignedTo,
      assignedBy: req.user._id,
      dueDate,
    });

    const createdTask = await task.save();

    // Notify Intern
    await createNotification(
      assignedTo,
      `New Task Assigned: ${title}`,
      'info',
      '/tasks'
    );

    res.status(201).json(createdTask);
  } catch (error) {
    res.status(400);
    next(error);
  }
};

// @desc    Get a task by ID
// @route   GET /api/tasks/:id
// @access  Private
export const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name email');

    if (task) {
      res.json(task);
    } else {
      res.status(404);
      throw new Error('Task not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private/Admin/Recruiter (or Student completing)
export const updateTask = async (req, res, next) => {
  try {
    const { title, description, status, dueDate } = req.body;

    const task = await Task.findById(req.params.id);

    if (task) {
      // Basic check, internships/recruiters could be more strict
      task.title = title || task.title;
      task.description = description || task.description;
      task.status = status || task.status;
      task.dueDate = dueDate || task.dueDate;

      const updatedTask = await task.save();

      // Notify Recruiter if task completed
      if (status === 'Completed') {
        await createNotification(
          task.assignedBy,
          `Intern ${req.user.name} completed task: ${task.title}`,
          'success',
          '/tasks'
        );
      } else if (status && status !== task.status) {
        // Notify assigner of any status change
        await createNotification(
          task.assignedBy,
          `Task status updated to ${status} for: ${task.title}`,
          'info',
          '/tasks'
        );
      }

      res.json(updatedTask);
    } else {
      res.status(404);
      throw new Error('Task not found');
    }
  } catch (error) {
    res.status(400);
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private/Admin/Recruiter
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (task) {
      res.json({ message: 'Task removed' });
    } else {
      res.status(404);
      throw new Error('Task not found');
    }
  } catch (error) {
    next(error);
  }
};
