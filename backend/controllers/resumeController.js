import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
import { GoogleGenerativeAI } from '@google/generative-ai';
import User from '../models/User.js';
import Internship from '../models/Internship.js';

// Initialize Gemini helper
const getGenAI = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not defined in .env file');
  }
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
};

/**
 * AI Fallback: Extracts text from PDF buffer using Gemini 1.5 Flash
 */
async function extractTextWithAI(buffer) {
  try {
    const genAI = getGenAI();
    // Using gemini-1.5-flash-latest for best compatibility on the v1beta endpoint
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
    
    const base64Data = buffer.toString('base64');
    
    // Using a more structured prompt to ensure we get a response
    const prompt = "Please act as an expert HR assistant. Read this resume and provide a full, detailed text transcription of all its content. Include Name, Skills, Education, Work Experience, and Links.";
    
    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Data,
          mimeType: 'application/pdf',
        },
      },
      prompt,
    ]);

    const response = await result.response;
    const text = response.text();
    
    if (!text) {
      console.warn('Gemini returned an empty response for PDF.');
    }
    
    return text || '';
  } catch (error) {
    console.error('CRITICAL AI ERROR:', error.message);
    // Return the actual error to help debugging
    if (error.message.includes('API_KEY_INVALID')) return 'ERROR: INVALID_API_KEY';
    if (error.message.includes('quota')) return 'ERROR: QUOTA_EXCEEDED';
    return `ERROR: ${error.message}`;
  }
}

// ─── Comprehensive Skill Dictionary ───────────────────────────────────────────
// Organized into categories for richer output
const SKILL_CATEGORIES = {
  Languages: [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'C', 'Go',
    'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Dart', 'Scala', 'R', 'MATLAB',
    'Bash', 'Shell', 'Perl', 'Lua', 'Haskell',
  ],
  Frontend: [
    'React', 'Next.js', 'Vue', 'Vue.js', 'Angular', 'Svelte', 'HTML', 'CSS',
    'SASS', 'SCSS', 'Tailwind', 'Bootstrap', 'Material UI', 'Chakra UI',
    'Redux', 'Zustand', 'Vite', 'Webpack', 'Babel', 'jQuery', 'Three.js',
    'GraphQL', 'Apollo', 'Axios', 'Framer Motion', 'Storybook',
  ],
  Backend: [
    'Node.js', 'Express', 'Express.js', 'Django', 'Flask', 'FastAPI', 'Spring',
    'Laravel', 'Rails', 'Ruby on Rails', 'ASP.NET', 'NestJS', 'Hapi', 'Koa',
    'REST', 'RESTful', 'gRPC', 'WebSocket', 'Socket.io', 'GraphQL',
  ],
  Databases: [
    'MongoDB', 'PostgreSQL', 'MySQL', 'SQLite', 'Redis', 'Cassandra',
    'DynamoDB', 'Firebase', 'Supabase', 'Prisma', 'Mongoose', 'Sequelize',
    'TypeORM', 'SQL', 'NoSQL', 'ElasticSearch',
  ],
  Cloud: [
    'AWS', 'Azure', 'GCP', 'Google Cloud', 'Heroku', 'Vercel', 'Netlify',
    'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'GitHub Actions', 'Jenkins',
    'Nginx', 'Linux', 'Ubuntu', 'EC2', 'S3', 'Lambda', 'CloudFront',
  ],
  'Data & AI': [
    'Machine Learning', 'Deep Learning', 'NLP', 'TensorFlow', 'PyTorch',
    'Keras', 'Scikit-learn', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn',
    'Jupyter', 'OpenCV', 'Hugging Face', 'LangChain', 'Data Analysis',
    'Data Science', 'Computer Vision', 'Reinforcement Learning', 'Tableau',
    'Power BI', 'Excel', 'Statistics',
  ],
  'Tools & Practices': [
    'Git', 'GitHub', 'GitLab', 'Bitbucket', 'Jira', 'Agile', 'Scrum',
    'Figma', 'Postman', 'VS Code', 'Linux', 'Microservices', 'DevOps',
    'Testing', 'Jest', 'Mocha', 'Cypress', 'Selenium', 'Playwright',
  ],
  'UI/UX & Design': [
    'Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator', 'Canva',
    'Wireframing', 'Prototyping', 'User Research', 'UX Writing',
  ],
  'Soft Skills & Business': [
    'Communication', 'Leadership', 'Project Management', 'Problem Solving',
    'Team Collaboration', 'Marketing', 'SEO', 'Content Writing',
    'Sales', 'Business Analysis', 'Product Management',
  ],
};

// Flatten into a single list with metadata
const ALL_SKILLS = Object.entries(SKILL_CATEGORIES).flatMap(([category, skills]) =>
  skills.map((skill) => ({ skill, category }))
);

// ─── Education Degree Detection ───────────────────────────────────────────────
const EDUCATION_PATTERNS = [
  { regex: /b\.?tech|bachelor of technology/i, label: 'B.Tech' },
  { regex: /m\.?tech|master of technology/i, label: 'M.Tech' },
  { regex: /b\.?e\.?|bachelor of engineering/i, label: 'B.E.' },
  { regex: /b\.?sc|bachelor of science/i, label: 'B.Sc.' },
  { regex: /m\.?sc|master of science/i, label: 'M.Sc.' },
  { regex: /b\.?c\.?a|bachelor of computer application/i, label: 'BCA' },
  { regex: /m\.?c\.?a|master of computer application/i, label: 'MCA' },
  { regex: /b\.?b\.?a|bachelor of business administration/i, label: 'BBA' },
  { regex: /m\.?b\.?a|master of business administration/i, label: 'MBA' },
  { regex: /b\.?com|bachelor of commerce/i, label: 'B.Com' },
  { regex: /ph\.?d|doctorate/i, label: 'Ph.D.' },
  { regex: /diploma/i, label: 'Diploma' },
  { regex: /12th|hsc|higher secondary/i, label: '12th / HSC' },
  { regex: /10th|ssc|secondary school/i, label: '10th / SSC' },
];

// ─── Core NLP Functions ───────────────────────────────────────────────────────

/**
 * Extracts matched skills from raw resume text with category metadata.
 */
function extractSkills(text) {
  const foundSkills = [];
  const foundCategories = {};
  const lowerText = text.toLowerCase();

  for (const { skill, category } of ALL_SKILLS) {
    // Use word boundary regex to avoid partial matches (e.g. "C" in "JavaScript")
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?<![a-zA-Z])${escaped}(?![a-zA-Z])`, 'i');
    if (regex.test(lowerText) || text.includes(skill)) {
      // Avoid duplicates (case-insensitive)
      if (!foundSkills.find((s) => s.skill.toLowerCase() === skill.toLowerCase())) {
        foundSkills.push({ skill, category });
        foundCategories[category] = (foundCategories[category] || 0) + 1;
      }
    }
  }

  return { skills: foundSkills, categories: foundCategories };
}

/**
 * Detects highest education level in resume text.
 */
function extractEducation(text) {
  for (const { regex, label } of EDUCATION_PATTERNS) {
    if (regex.test(text)) return label;
  }
  return 'Not Detected';
}

/**
 * Extracts frequent non-common words as "keywords" (simple TF-based approach).
 */
function extractKeywords(text) {
  const STOPWORDS = new Set([
    'the', 'and', 'for', 'with', 'you', 'are', 'was', 'has', 'had', 'have',
    'that', 'this', 'from', 'your', 'our', 'their', 'they', 'will', 'can',
    'not', 'but', 'his', 'her', 'its', 'all', 'been', 'also', 'into', 'over',
    'any', 'use', 'via', 'per', 'see', 'com', 'www', 'http', 'https',
  ]);

  const words = text
    .toLowerCase()
    .replace(/[^a-zA-Z\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOPWORDS.has(w));

  const freq = {};
  words.forEach((w) => (freq[w] = (freq[w] || 0) + 1));

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([word]) => word);
}

/**
 * Extracts Social Links using simple Regex
 */
function extractLinks(text) {
  const githubLink = text.match(/(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+/i);
  const linkedinLink = text.match(/(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
  
  return {
    github: githubLink ? githubLink[0] : '',
    linkedin: linkedinLink ? linkedinLink[0] : ''
  };
}

/**
 * Calculates a match score (0-100%) between a student's skills and an internship.
 * Uses a weighted algorithm: exact skill match + keyword overlap.
 */
function calculateMatchScore(userSkillNames, internship) {
  const descText = `${internship.title} ${internship.description}`.toLowerCase();
  
  if (userSkillNames.length === 0) return 0;

  let matchCount = 0;
  let totalWeight = 0;

  for (const skill of userSkillNames) {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?<![a-zA-Z])${escaped}(?![a-zA-Z])`, 'i');
    if (regex.test(descText) || descText.includes(skill.toLowerCase())) {
      matchCount++;
    }
    totalWeight++;
  }

  // Base score from skill match ratio
  const skillScore = totalWeight > 0 ? (matchCount / totalWeight) * 100 : 0;
  
  // Bonus: check if the internship mentions general fields matching the resume
  const bonusKeywords = ['web development', 'software', 'data', 'design', 'marketing', 'fullstack', 'frontend', 'backend'];
  let bonus = 0;
  bonusKeywords.forEach((kw) => {
    if (descText.includes(kw) && userSkillNames.some((s) => s.toLowerCase().includes(kw.split(' ')[0]))) {
      bonus += 5;
    }
  });

  return Math.min(Math.round(skillScore + bonus), 100);
}

// ─── Controller: POST /api/resume/analyze ────────────────────────────────────

export const analyzeResume = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('No PDF file uploaded. Please attach a PDF resume.');
    }

    if (req.file.mimetype !== 'application/pdf') {
      res.status(400);
      throw new Error('Only PDF files are accepted.');
    }

    // Step 1: Extract text from PDF buffer
    let pdfText = '';
    try {
      const data = await pdfParse(req.file.buffer);
      pdfText = data.text;
    } catch (pdfErr) {
      res.status(422);
      throw new Error('Could not read the PDF. Please upload a valid, text-based PDF.');
    }

    if (!pdfText || pdfText.trim().length < 50) {
      // AI Fallback for scanned/complex PDFs
      if (!process.env.GEMINI_API_KEY) {
        res.status(500);
        throw new Error('AI API Key is missing. Please check your .env file.');
      }
      
      pdfText = await extractTextWithAI(req.file.buffer);
      
      if (pdfText.startsWith('ERROR:')) {
        res.status(500);
        throw new Error(`AI Service Issue: ${pdfText.replace('ERROR: ', '')}`);
      }

      if (!pdfText || pdfText.trim().length < 20) {
        res.status(422);
        throw new Error('Resume appears to be empty or image-based, and AI could not extract content. Please upload a text-based PDF.');
      }
    }

    // Step 2: NLP Analysis
    const { skills: extractedSkillObjects, categories } = extractSkills(pdfText);
    const education = extractEducation(pdfText);
    const keywords = extractKeywords(pdfText);
    const skillNames = extractedSkillObjects.map((s) => s.skill);

    // Step 3: Match with all open internships
    const internships = await Internship.find({ status: 'Open' });
    const matches = internships
      .map((internship) => ({
        _id: internship._id,
        title: internship.title,
        company: internship.company,
        location: internship.location,
        stipend: internship.stipend,
        description: internship.description,
        matchScore: calculateMatchScore(skillNames, internship),
      }))
      .sort((a, b) => b.matchScore - a.matchScore);

    // Step 4: Persist to user profile
    const user = await User.findById(req.user._id);
    if (user) {
      user.skills = skillNames;
      user.keywords = keywords;
      user.education = education;
      user.isProfileAnalyzed = true;
      await user.save();
    }

    // Step 5: Return full analysis result
    res.json({
      success: true,
      analysis: {
        skillsByCategory: extractedSkillObjects.reduce((acc, { skill, category }) => {
          if (!acc[category]) acc[category] = [];
          acc[category].push(skill);
          return acc;
        }, {}),
        allSkills: skillNames,
        education,
        keywords,
        totalSkillsFound: skillNames.length,
        categoryBreakdown: categories,
      },
      matches,
      summary: {
        totalInternships: internships.length,
        strongMatches: matches.filter((m) => m.matchScore >= 70).length,
        moderateMatches: matches.filter((m) => m.matchScore >= 40 && m.matchScore < 70).length,
        weakMatches: matches.filter((m) => m.matchScore < 40).length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── Controller: GET /api/resume/profile ─────────────────────────────────────
// Returns previously analyzed resume data from user profile

export const getResumeProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('skills keywords education isProfileAnalyzed');
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    if (!user.isProfileAnalyzed) {
      return res.json({ analyzed: false });
    }

    // Re-run matching with saved skills
    const internships = await Internship.find({ status: 'Open' });
    const matches = internships
      .map((internship) => ({
        _id: internship._id,
        title: internship.title,
        company: internship.company,
        location: internship.location,
        stipend: internship.stipend,
        matchScore: calculateMatchScore(user.skills, internship),
      }))
      .sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      analyzed: true,
      skills: user.skills,
      keywords: user.keywords,
      education: user.education,
      matches,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Controller: POST /api/resume/parse-only ─────────────────────────────────
export const parseResumeOnly = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('No PDF file uploaded. Please attach a PDF resume.');
    }

    if (req.file.mimetype !== 'application/pdf') {
      res.status(400);
      throw new Error('Only PDF files are accepted.');
    }

    let pdfText = '';
    try {
      const data = await pdfParse(req.file.buffer);
      pdfText = data.text;
    } catch (pdfErr) {
      res.status(422);
      throw new Error('Could not read the PDF. Please upload a valid, text-based PDF.');
    }

    if (!pdfText || pdfText.trim().length < 50) {
      // AI Fallback for scanned/complex PDFs
      if (!process.env.GEMINI_API_KEY) {
        res.status(500);
        throw new Error('AI API Key is missing. Please check your .env file.');
      }

      const genAI = getGenAI();
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

      const prompt = `Please act as an expert HR assistant. Read this resume and extract the following details in a clean JSON format:
      {
        "name": "string",
        "phone": "string",
        "location": "string",
        "bio": "short tagline or summary",
        "collegeName": "string",
        "degree": "string",
        "branch": "string",
        "graduationYear": "string",
        "skills": ["string"],
        "links": {"github": "string", "linkedin": "string"},
        "experience": [{"role": "string", "company": "string", "duration": "string", "description": "string"}]
      }
      Extract as much as possible. If not found, use an empty string.`;
      
      const result = await model.generateContent([
        {
          inlineData: {
            data: req.file.buffer.toString('base64'),
            mimeType: 'application/pdf',
          },
        },
        prompt,
      ]);

      const response = await result.response;
      const aiText = response.text();
      
      try {
        const jsonMatch = aiText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const data = JSON.parse(jsonMatch[0]);
          return res.json({ success: true, ...data });
        }
      } catch (e) { console.error('AI JSON parse failed', e); }

      if (!aiText || aiText.length < 20) {
        res.status(422);
        throw new Error('Resume appears to be empty, and AI could not extract content.');
      }
      pdfText = aiText;
    }

    // Step 2: Use AI for structured extraction from the text (for digital PDFs)
    if (process.env.GEMINI_API_KEY) {
      try {
        const genAI = getGenAI();
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

        const structuredPrompt = `Please act as an expert HR assistant. Read the following resume text and extract details in a clean JSON format:
        {
          "name": "string",
          "phone": "string",
          "location": "string",
          "bio": "short tagline/summary",
          "collegeName": "string",
          "degree": "string",
          "branch": "string",
          "graduationYear": "string",
          "skills": ["string"],
          "links": {"github": "string", "linkedin": "string"},
          "experience": [{"role": "string", "company": "string", "duration": "string", "description": "string"}]
        }
        
        Resume Text:
        ${pdfText.substring(0, 10000)}`;

        const result = await model.generateContent(structuredPrompt);
        const response = await result.response;
        const aiText = response.text();

        const jsonMatch = aiText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
           const data = JSON.parse(jsonMatch[0]);
           return res.json({ success: true, ...data });
        }
      } catch (aiErr) { console.error('Text AI extraction failed', aiErr); }
    }

    // Final Fallback: Step 3: NLP Analysis (Regex based)
    const { skills: extractedSkillObjects } = extractSkills(pdfText);
    const education = extractEducation(pdfText);
    const links = extractLinks(pdfText);
    
    res.json({
      success: true,
      education,
      skills: extractedSkillObjects.map(s => s.skill),
      github: links.github,
      linkedin: links.linkedin,
      experience: []
    });
  } catch (error) {
    next(error);
  }
};
