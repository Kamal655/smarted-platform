import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Internship from './models/Internship.js';
import Application from './models/Application.js';
import connectDB from './config/db.js';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

dotenv.config();

/**
 * Global Seeder Logic 
 * ─────────────────────────────────────────────
 * Populates the database with 100+ Elite Talent profiles.
 */

const NAMES = [
  "Aarav Sharma", "Aditi Rao", "Amit Patel", "Ananya Singh", "Arjun Reddy", "Divya Menon", "Ishaan Gupta", "Kavya Iyer",
  "Nikhil Verma", "Pooja Hegde", "Rahul Nair", "Saira Khan", "Vivek Joshi", "Zoya Ahmed", "Rohan Malhotra", "Sanya Kapoor",
  "Tushar Deshmukh", "Megha Kulkarni", "Pranav Kulkarni", "Neha Bansal", "Akash Mittal", "Priya Chatterjee", "Sumanth Rao"
];

const COLLEGES = [
  "IIT Hyderabad", "IIT Bombay", "NIT Trichy", "BITS Pilani", "IIT Madras", "IIIT Hyderabad", "DTU Delhi", "Vellore Institute of Technology"
];

const SKILLS = ["React.js", "Node.js", "Python", "MERN Stack", "AWS", "Docker", "Kubernetes", "Tailwind CSS", "TypeScript", "Next.js", "PostgreSQL", "MongoDB"];

export const seedData = async (shouldExit = true) => {
  try {
    if (mongoose.connection.readyState === 0) {
      await connectDB();
    }

    console.log('🧹 Clearing existing data...');
    await User.deleteMany();
    await Internship.deleteMany();
    await Application.deleteMany();

    const password = await bcrypt.hash('student123', 10);
    const proPassword = await bcrypt.hash('password123', 10);

    // 1. Create Core Users
    console.log('👥 Creating System Accounts...');
    const coreUsers = await User.insertMany([
      { name: 'System Admin', email: 'admin@internspace.com', password: 'adminpassword123', role: 'admin' },
      { name: 'Professional Admin', email: 'admin.pro@smarted.in', password: proPassword, role: 'admin', bio: 'System Administrator with expertise in platform scaling.' },
      { name: 'SmartED Recruiter', email: 'recruiter@smarted.in', password: 'recruiterpassword123', role: 'recruiter', bio: 'Senior Talent Acquisition Manager' },
      { name: 'Kamal', email: 'kamal1@gmail.com', password: proPassword, role: 'student', skills: ['React.js', 'Node.js', 'Tailwind CSS', 'Python'], collegeName: 'IIT Hyderabad', degree: 'B.Tech', branch: 'Computer Science', graduationYear: '2026', cgpa: '9.2', isProfileAnalyzed: true, bio: 'Full-stack developer focused on engineering excellence.' },
      { name: 'Elite Candidate', email: 'jane@student.com', password: 'studentpassword123', role: 'student', skills: ['React', 'JavaScript', 'Node.js', 'Tailwind CSS'], isProfileAnalyzed: true, collegeName: 'IIT Madras', degree: 'B.Tech', cgpa: '9.4' }
    ]);

    const recruiterId = coreUsers[1]._id;

    // 2. Create Internships
    console.log('💼 Creating Professional Internship Listings...');
    const internships = await Internship.insertMany([
      { title: 'Frontend Developer Intern', company: 'SmartED Innovations', location: 'Remote', description: 'Build premium UIs with React/Tailwind.', stipend: 15000, postedBy: recruiterId, status: 'Open' },
      { title: 'Full-Stack Developer', company: 'Nexus AI', location: 'Hyderabad', description: 'End-to-end MERN development.', stipend: 25000, postedBy: recruiterId, status: 'Open' },
      { title: 'AI Research Intern', company: 'DeepMind Labs', location: 'Remote', description: 'ML model training and optimization.', stipend: 35000, postedBy: recruiterId, status: 'Open' },
      { title: 'Data Science Trainee', company: 'Insight Analytics', location: 'Mumbai', description: 'EDA and predictive modeling.', stipend: 22000, postedBy: recruiterId, status: 'Open' },
      { title: 'Cyber Security Intern', company: 'SecureNet', location: 'Hyderabad', description: 'Network security and pen-testing.', stipend: 20000, postedBy: recruiterId, status: 'Open' }
    ]);

    // 3. Generate 100 "Lush" Talent Profiles
    console.log('🚀 Generating 100 Elite Student Profiles...');
    const students = [];
    for (let i = 1; i <= 100; i++) {
      const skills = SKILLS.sort(() => 0.5 - Math.random()).slice(0, 5);
      students.push({
        name: `${NAMES[i % NAMES.length]} ${i}`,
        email: `talent.${i}@smarted.in`,
        password, // Pre-hashed
        role: 'student',
        bio: `Aspiring ${skills[0]} developer focused on engineering excellence.`,
        skills,
        collegeName: COLLEGES[i % COLLEGES.length],
        degree: 'B.Tech',
        branch: 'Computer Science',
        graduationYear: "2026",
        cgpa: (Math.random() * (9.8 - 8.2) + 8.2).toFixed(2),
        experience: [{ role: "Technical Intern", company: "TechFlow", duration: "3 Months", description: "Developed scalable components." }]
      });
    }
    const createdStudents = await User.insertMany(students);

    // 4. Seeding Applications
    console.log('📝 Simulating 60+ Pipeline Applications...');
    const applications = [];
    const statuses = ['Pending', 'Accepted', 'Rejected'];

    for (let j = 0; j < 65; j++) {
      const student = createdStudents[Math.floor(Math.random() * createdStudents.length)];
      const internship = internships[Math.floor(Math.random() * internships.length)];

      applications.push({
        student: student._id,
        internship: internship._id,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        resume: 'https://smarted.in/demo-resume.pdf',
        answers: { 'Background': 'Strong background in algorithms and systems.' }
      });
    }
    await Application.insertMany(applications);

    console.log('✅ DATABASE FULLY SEEDED WITH ELITE TALENT!');
    if (shouldExit) process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding Failed: ${error.message}`);
    if (shouldExit) process.exit(1);
    throw error;
  }
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  seedData();
}
