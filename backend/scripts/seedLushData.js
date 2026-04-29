import mongoose from 'mongoose';
import User from '../models/User.js';
import Internship from '../models/Internship.js';
import Application from '../models/Application.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const NAMES = [
  "Aarav Sharma", "Aditi Rao", "Amit Patel", "Ananya Singh", "Arjun Reddy", "Divya Menon", "Ishaan Gupta", "Kavya Iyer", 
  "Nikhil Verma", "Pooja Hegde", "Rahul Nair", "Saira Khan", "Vivek Joshi", "Zoya Ahmed", "Rohan Malhotra", "Sanya Kapoor",
  "Tushar Deshmukh", "Megha Kulkarni", "Pranav Kulkarni", "Neha Bansal", "Akash Mittal", "Priya Chatterjee", "Sumanth Rao",
  "Varun Tej", "Nidhi Agarwal", "Sunny Leone", "Ranbir Kapoor", "Alia Bhatt", "Deepika Padukone", "Shah Rukh Khan"
];

const COLLEGES = [
  "IIT Hyderabad", "IIT Bombay", "NIT Trichy", "BITS Pilani", "IIT Madras", "IIIT Hyderabad", "DTU Delhi", "Vellore Institute of Technology",
  "Manipal Institute of Technology", "SRM University", "Anna University", "JNTU Hyderabad", "Osmania University"
];

const DEGREES = ["B.Tech", "B.E", "M.Tech", "MCA", "M.Sc"];
const BRANCHES = ["Computer Science", "Information Technology", "AI & ML", "Data Science", "Software Engineering"];
const SKILLS = ["React.js", "Node.js", "Python", "MERN Stack", "AWS", "Docker", "Kubernetes", "Tailwind CSS", "TypeScript", "Next.js", "PostgreSQL", "MongoDB", "Redux", "GraphQL", "Figma", "UI/UX"];

const seedTalent = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/internspace';
    await mongoose.connect(mongoUri);
    console.log('Connected to Database for seeding...');

    // 1. Cleanup old seed data (optional, but keeps it clean)
    // await User.deleteMany({ email: { $regex: /talent\.\d+@smarted\.in/ } });
    // await Application.deleteMany({ applicationNote: 'SEED_DATA' });

    const internships = await Internship.find();
    if (internships.length === 0) {
      console.log('No internships found. Please post an internship first.');
      process.exit(1);
    }

    console.log(`Generating 100 students and applications for ${internships.length} internships...`);

    const students = [];
    const password = await bcrypt.hash('student123', 10);

    for (let i = 1; i <= 100; i++) {
      const name = NAMES[i % NAMES.length] + " " + i;
      const skills = SKILLS.sort(() => 0.5 - Math.random()).slice(0, 5);
      
      students.push({
        name,
        email: `talent.${i}@smarted.in`,
        password,
        role: 'student',
        bio: `Aspiring ${skills[0]} developer passionate about building high-impact products.`,
        skills,
        collegeName: COLLEGES[i % COLLEGES.length],
        degree: DEGREES[i % DEGREES.length],
        branch: BRANCHES[i % BRANCHES.length],
        graduationYear: "2026",
        cgpa: (Math.random() * (9.8 - 8.0) + 8.0).toFixed(2),
        location: "Hyderabad, India",
        github: `github.com/talent${i}`,
        linkedin: `linkedin.com/in/talent${i}`,
        experience: [
          {
            role: "Software Intern",
            company: "TechFlow Solutions",
            duration: "3 Months",
            description: "Developed frontend components using React and styled-components."
          }
        ]
      });
    }

    const createdStudents = await User.insertMany(students);
    console.log('✅ 100 Professional Students Created.');

    // 2. Create Applications
    const applications = [];
    for (let j = 0; j < 60; j++) {
      const student = createdStudents[Math.floor(Math.random() * createdStudents.length)];
      const internship = internships[Math.floor(Math.random() * internships.length)];
      const statuses = ['Pending', 'Shortlisted', 'Accepted', 'Rejected'];
      
      applications.push({
        student: student._id,
        internship: internship._id,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        resume: 'https://smarted.in/demo-resume.pdf',
        answers: { 'Why join?': 'Passionate about SmartED Innovations mission.' },
        applicationNote: 'SEED_DATA' // Helping us identify seed data
      });
    }

    await Application.insertMany(applications);
    console.log(`✅ ${applications.length} Simulated Applications Created.`);

    console.log('🏁 SEEDING COMPLETE. Your Dashboard is now professional-grade.');
    process.exit(0);
  } catch (err) {
    console.error('❌ SEEDING FAILED:', err);
    process.exit(1);
  }
};

seedTalent();
