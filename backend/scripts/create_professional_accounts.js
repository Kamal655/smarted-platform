import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Internship from '../models/Internship.js';
import Application from '../models/Application.js';
import connectDB from '../config/db.js';

dotenv.config();

const createAccounts = async () => {
  try {
    await connectDB();

    console.log('🧹 Preparing professional accounts...');

    // Delete existing accounts with these emails to avoid unique constraint errors
    await User.deleteMany({ email: { $in: ['kamal1@gmail.com', 'admin.pro@smarted.in'] } });

    // 1. Create Professional Student Account (Kamal)
    const studentData = {
      name: 'Kamal',
      email: 'kamal1@gmail.com',
      password: 'password123', // Will be hashed by pre-save hook
      role: 'student',
      skills: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'Python', 'Docker'],
      collegeName: 'IIT Hyderabad',
      degree: 'B.Tech',
      branch: 'Computer Science',
      graduationYear: '2026',
      cgpa: '9.2',
      bio: 'Full-stack developer with a passion for building scalable web applications and AI-driven solutions.',
      location: 'Hyderabad, India',
      linkedin: 'https://linkedin.com/in/kamal-pro',
      github: 'https://github.com/kamal-dev',
      isProfileAnalyzed: true,
      experience: [
        {
          role: 'Web Developer Intern',
          company: 'Tech Solutions Inc.',
          duration: '3 Months',
          description: 'Developed responsive dashboard components using React and optimized API endpoints.'
        }
      ]
    };

    const student = await User.create(studentData);
    console.log('✅ Student Account Created: kamal1@gmail.com');

    // 2. Create Professional Admin Account
    const adminData = {
      name: 'Professional Admin',
      email: 'admin.pro@smarted.in',
      password: 'password123',
      role: 'admin',
      bio: 'System Administrator with expertise in platform scaling and user management.',
      location: 'Bangalore, India'
    };

    await User.create(adminData);
    console.log('✅ Admin Account Created: admin.pro@smarted.in');

    // 3. Create some applications for Kamal to make it look "professional"
    const internships = await Internship.find().limit(3);
    if (internships.length > 0) {
      console.log('📝 Adding sample applications for Kamal...');
      const applicationData = internships.map(internship => ({
        student: student._id,
        internship: internship._id,
        status: 'Pending',
        resume: 'https://smarted.in/resumes/kamal_cv.pdf',
        answers: {
          'Why do you want this role?': 'I have strong skills in the required tech stack and I am eager to contribute to real-world projects.'
        }
      }));
      await Application.insertMany(applicationData);
      console.log('✅ Sample applications added.');
    }

    console.log('\n🚀 PROFESSIONAL ACCOUNTS READY:');
    console.log('──────────────────────────────────');
    console.log('STUDENT:');
    console.log('  Email: kamal1@gmail.com');
    console.log('  Pass:  password123');
    console.log('──────────────────────────────────');
    console.log('ADMIN:');
    console.log('  Email: admin.pro@smarted.in');
    console.log('  Pass:  password123');
    console.log('──────────────────────────────────');

    process.exit(0);
  } catch (error) {
    console.error(`❌ Error creating accounts: ${error.message}`);
    process.exit(1);
  }
};

createAccounts();
