import mongoose from 'mongoose';

const aiInsightSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    internship: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Internship',
    },
    type: {
      type: String,
      enum: ['roadmap', 'interview_prep', 'candidate_summary', 'match_score'],
      required: true,
    },
    content: {
      type: mongoose.Schema.Types.Mixed, // Stores JSON structure of the AI result
      required: true,
    },
    lastGenerated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure we only store one insight of a specific type per user/internship pair
aiInsightSchema.index({ user: 1, internship: 1, type: 1 }, { unique: true });

const AIInsight = mongoose.model('AIInsight', aiInsightSchema);

export default AIInsight;
