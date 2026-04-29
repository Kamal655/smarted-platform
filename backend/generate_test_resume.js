import PDFDocument from 'pdfkit';
import fs from 'fs';

const doc = new PDFDocument();
const outputPath = 'Sample_Resume.pdf';

doc.pipe(fs.createWriteStream(outputPath));

// Header
doc.fontSize(24).text('JANE DEV', { align: 'center' });
doc.fontSize(12).text('Full Stack Developer | React Enthusiast', { align: 'center' });
doc.text('Email: jane.dev@student.com | Phone: +1 123 456 7890', { align: 'center' });
doc.moveDown();

// Education
doc.fontSize(16).text('EDUCATION', { underline: true });
doc.fontSize(12).text('Bachelor of Technology (B.Tech) in Computer Science');
doc.text('Modern University of Technology | 2021 - 2025');
doc.moveDown();

// Technical Skills
doc.fontSize(16).text('TECHNICAL SKILLS', { underline: true });
doc.fontSize(12).text('• Languages: JavaScript (ES6+), HTML5, CSS3, Python');
doc.text('• Frontend: React, Next.js, Redux, Tailwind CSS, Material UI');
doc.text('• Backend: Node.js, Express.js, REST APIs');
doc.text('• Databases: MongoDB, Mongoose, PostgreSQL');
doc.text('• Tools: Git, GitHub, Docker, Postman, Vite');
doc.moveDown();

// Projects
doc.fontSize(16).text('PROJECTS', { underline: true });
doc.fontSize(12).text('InternFlow - Internship Management System');
doc.text('• Built a full-stack platform using MERN stack and Tailwind CSS v4.');
doc.text('• Integrated AI-powered resume analysis and real-time chat.');
doc.moveDown();

doc.text('Personal Portfolio');
doc.text('• Developed a responsive portfolio site with Framer Motion and React.');
doc.moveDown();

// Experience
doc.fontSize(16).text('EXPERIENCE', { underline: true });
doc.fontSize(12).text('Open Source Contributor | GitHub');
doc.text('• Contributed to various React and Node.js projects.');
doc.moveDown();

doc.end();

console.log(`✅ Sample Resume generated at: ${outputPath}`);
