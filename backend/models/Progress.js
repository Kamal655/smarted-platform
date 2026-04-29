import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    hoursWorked: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      required: true,
    },
    githubUrl: {
      type: String,
    },
    recruiterFeedback: {
      type: String,
    },
  },
  { timestamps: true }
);

const Progress = mongoose.model('Progress', progressSchema);

export default Progress;
