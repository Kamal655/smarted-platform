import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'student', 'recruiter'],
      default: 'student',
    },
    skills: {
      type: [String],
      default: [],
    },
    keywords: {
      type: [String],
      default: [],
    },
    education: {
      type: String,
      default: '',
    },
    avatar: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    github: {
      type: String,
      default: '',
    },
    linkedin: {
      type: String,
      default: '',
    },
    portfolio: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    collegeName: {
      type: String,
      default: '',
    },
    degree: {
      type: String,
      default: '',
    },
    branch: {
      type: String,
      default: '',
    },
    graduationYear: {
      type: String,
      default: '',
    },
    cgpa: {
      type: String,
      default: '',
    },
    dob: {
      type: String,
      default: '',
    },
    gender: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    hobbies: {
      type: [String],
      default: [],
    },
    languages: {
      type: [String],
      default: [],
    },
    certifications: {
      type: [String],
      default: [],
    },
    isProfileAnalyzed: {
      type: Boolean,
      default: false,
    },
    experience: [
      {
        role: String,
        company: String,
        duration: String,
        description: String,
      }
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;
