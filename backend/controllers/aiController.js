import { GoogleGenerativeAI } from '@google/generative-ai';
import AIInsight from '../models/AIInsight.js';
import User from '../models/User.js';
import Internship from '../models/Internship.js';

/**
 * Helper: Call Gemini API with a specific prompt
 */
const callGemini = async (prompt) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY') {
    throw new Error('GEMINI_API_KEY is not configured or using placeholder. Please provide a valid key from Google AI Studio.');
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // Explicitly use gemini-1.5-flash-latest to ensure we're targeting the most stable updated endpoint
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up potential markdown code block markers if the AI returns them
    return text.replace(/```json|```/g, '').trim();
  } catch (error) {
    if (error.message?.includes('403') || error.message?.includes('API key not valid')) {
      throw new Error('Your GEMINI_API_KEY appears to be invalid. Please check your .env file.');
    }
    if (error.message?.includes('404') || error.message?.includes('model not found')) {
      throw new Error('The AI model "gemini-1.5-flash" was not found for this key. Please verify your Google AI Studio account.');
    }
    throw error;
  }
};

/**
 * Generate Smart Career Roadmap
 * GET /api/ai/roadmap/:internshipId
 */
export const getCareerRoadmap = async (req, res, next) => {
  try {
    const { internshipId } = req.params;
    const userId = req.user._id;

    // 1. Check for existing insight to save API costs & show MERN persistence
    let insight = await AIInsight.findOne({ user: userId, internship: internshipId, type: 'roadmap' });
    if (insight) return res.json(insight.content);

    // 2. Gather Context
    const [user, internship] = await Promise.all([
      User.findById(userId).select('name skills education'),
      Internship.findById(internshipId).select('title description company'),
    ]);

    if (!internship) return res.status(404).json({ message: 'Internship not found' });

    const prompt = `
      You are a Senior Career Coach. Create a 3-month (12-week) learning roadmap for a student to get an internship.
      
      STUDENT CONTEXT:
      - Skills: ${user.skills.join(', ') || 'Beginner'}
      - Education: ${user.education || 'Not specified'}
      
      TARGET INTERNSHIP:
      - Title: ${internship.title} at ${internship.company}
      - Requirements: ${internship.description}
      
      OUTPUT FORMAT:
      Return ONLY a JSON object with this structure:
      {
        "title": "Roadmap to ${internship.title}",
        "summary": "Short 2-sentence strategy",
        "weeks": [
          { "week": 1, "topic": "Title", "tasks": ["task1", "task2"], "resources": "suggested tools" },
          ... up to week 12
        ],
        "finalGoal": "What they should achieve by the end"
      }
    `;

    const aiResponse = await callGemini(prompt).catch(() => {
      console.warn('⚠️ GEMINI_API_KEY invalid or missing. Returning Demo Roadmap.');
      return JSON.stringify({
        "title": `Roadmap to ${internship.title} [Demo Mode]`,
        "summary": `This specialized 12-week track will bridge your existing skills in ${user.skills.slice(0, 2).join(', ')} with the specific requirements at ${internship.company}.`,
        "weeks": [
          { "week": 1, "topic": "Foundations & Environment", "tasks": ["Initial setup", "Core concepts"], "resources": "Official Docs" },
          { "week": 2, "topic": "Core Implementation", "tasks": ["Advanced patterns", "Best practices"], "resources": "Community Guides" },
          { "week": 3, "topic": "Project Integration", "tasks": ["Build prototype", "Modular design"], "resources": "SmartED Hub" }
        ],
        "finalGoal": "Successfully complete a production-ready project and pass the final technical assessment."
      });
    });
    
    const roadmapData = JSON.parse(aiResponse);

    // 3. Save to MongoDB (The 'M' in MERN)
    insight = await AIInsight.create({
      user: userId,
      internship: internshipId,
      type: 'roadmap',
      content: roadmapData
    });

    res.json(roadmapData);
  } catch (error) {
    console.error('Roadmap Error:', error);
    res.status(500).json({ message: 'Failed to generate AI Roadmap', error: error.message });
  }
};

/**
 * Generate Interview Prep Questions
 * GET /api/ai/interview-prep/:internshipId
 */
export const getInterviewPrep = async (req, res, next) => {
  try {
    const { internshipId } = req.params;
    const userId = req.user._id;

    let insight = await AIInsight.findOne({ user: userId, internship: internshipId, type: 'interview_prep' });
    if (insight) return res.json(insight.content);

    const [user, internship] = await Promise.all([
      User.findById(userId).select('name skills'),
      Internship.findById(internshipId).select('title description company'),
    ]);

    const prompt = `
      Act as a technical interviewer for ${internship.title}. 
      Generate 5 targeted interview questions for this student based on their skills and the job description.
      
      STUDENT SKILLS: ${user.skills.join(', ')}
      JOB DESCRIPTION: ${internship.description}
      
      OUTPUT FORMAT:
      Return ONLY a JSON array of objects:
      [
        { "question": "The question text", "type": "Technical/Behavioral", "tip": "Brief advice on how to answer" },
        ...
      ]
    `;

    const aiResponse = await callGemini(prompt).catch(() => {
      console.warn('⚠️ GEMINI_API_KEY invalid or missing. Returning Demo Interview Prep.');
      return JSON.stringify([
        { "question": `How do you handle complex technical challenges in ${user.skills[0] || 'your core area'}?`, "type": "Technical", "tip": "Focus on your problem-solving process." },
        { "question": "Walk me through your most impactful project.", "type": "Technical", "tip": "Explain the 'Why' behind your architectural choices." },
        { "question": "How do you align with the core mission of SmartED Innovations?", "type": "Behavioral", "tip": "Mention your passion for bridging education gaps." }
      ]);
    });
    const prepData = JSON.parse(aiResponse);

    insight = await AIInsight.create({
      user: userId,
      internship: internshipId,
      type: 'interview_prep',
      content: prepData
    });

    res.json(prepData);
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate Interview Prep', error: error.message });
  }
};

/**
 * Generate Recruiter Candidate Summary
 * GET /api/ai/candidate-summary/:studentId/:internshipId
 */
export const getCandidateSummary = async (req, res, next) => {
  try {
    const { studentId, internshipId } = req.params;
    
    // Only recruiters can access this
    if (req.user.role !== 'recruiter') return res.status(403).json({ message: 'Restricted' });

    let insight = await AIInsight.findOne({ user: studentId, internship: internshipId, type: 'candidate_summary' });
    if (insight) return res.json(insight.content);

    const [student, internship] = await Promise.all([
      User.findById(studentId).select('name skills education keywords'),
      Internship.findById(internshipId).select('title description company'),
    ]);

    const prompt = `
      You are an AI Hiring Assistant for recruiters. Summarize why this candidate is a good fit for the "${internship.title}" role.
      
      CANDIDATE: ${student.name}
      CANDIDATE SKILLS: ${student.skills.join(', ')}
      CANDIDATE KEYWORDS: ${student.keywords.join(', ')}
      
      INTERNSHIP REQUIREMENTS: ${internship.description}
      
      OUTPUT FORMAT:
      Return ONLY a JSON object:
      {
        "summary": "1-2 powerful sentences on suitability",
        "topStrengths": ["Strength 1", "Strength 2"],
        "potentialGap": "One thing they might need to learn",
        "verdict": "Fit / Strong Fit / Expert Fit"
      }
    `;

    const aiResponse = await callGemini(prompt).catch(() => {
      console.warn('⚠️ GEMINI_API_KEY invalid or missing. Returning Demo Candidate Summary.');
      return JSON.stringify({
        "summary": `${student.name} is a high-potential candidate with strong foundations in ${student.skills.slice(0, 3).join(', ')}.`,
        "topStrengths": ["Rapid Upskilling", "Brand Alignment"],
        "potentialGap": "Requires specialized workshop on production-scale systems.",
        "verdict": "Strong Fit [Demo Mode]"
      });
    });
    const summaryData = JSON.parse(aiResponse);

    insight = await AIInsight.create({
      user: studentId,
      internship: internshipId,
      type: 'candidate_summary',
      content: summaryData
    });

    res.json(summaryData);
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate Candidate Summary', error: error.message });
  }
};

/**
 * Generate Semantic AI Match Score
 * GET /api/ai/match/:internshipId
 */
export const getMatchScore = async (req, res, next) => {
  try {
    const { internshipId } = req.params;
    const userId = req.user._id;

    // 1. Check if cached insight exists
    let insight = await AIInsight.findOne({ user: userId, internship: internshipId, type: 'match_score' });
    if (insight) return res.json(insight.content);

    // 2. Fetch context
    const [user, internship] = await Promise.all([
      User.findById(userId).select('name skills education keywords'),
      Internship.findById(internshipId).select('title description company criteria'),
    ]);

    if (!internship) return res.status(404).json({ message: 'Internship not found' });

    // 3. Prompt for Semantic Match
    const prompt = `
      You are an elite AI technical recruiter. Calculate a Semantic Fit Score (0-100) between this candidate and the internship.
      Do not just do keyword matching. Understand related concepts (e.g., if a job needs Node.js and they know Express, that's a partial match).

      STUDENT PROFILE:
      - Skills: ${user.skills.join(', ')}
      - Keywords (from parsed resume): ${user.keywords.join(', ')}

      INTERNSHIP:
      - Title: ${internship.title}
      - Needs: ${internship.description}
      - Strict Criteria: ${internship.criteria || 'None'}

      OUTPUT FORMAT:
      Return ONLY a strict JSON object with this exact structure:
      {
        "score": <NUMBER_BETWEEN_0_100>,
        "reasoning": "A highly concise 2-sentence explanation of why they got this score, highlighting the biggest strength and the biggest missing piece."
      }
    `;

    const aiResponse = await callGemini(prompt).catch(() => {
      console.warn('⚠️ GEMINI_API_KEY invalid or missing. Returning Demo Match Score.');
      const baseScore = Math.floor(Math.random() * 15) + 75; // Generate a "Smart Student" score between 75-90
      return JSON.stringify({
        "score": baseScore,
        "reasoning": `[DEMO MODE] Great alignment between your skill in ${user.skills[0] || 'Development'} and the needs at ${internship.company}. High fit score based on SmartED benchmarks.`
      });
    });
    const matchData = JSON.parse(aiResponse);

    // 4. Save to Insight DB
    insight = await AIInsight.create({
      user: userId,
      internship: internshipId,
      type: 'match_score',
      content: matchData
    });

    res.json(matchData);
  } catch (error) {
    console.error('Match Score Error:', error);
    res.status(500).json({ message: 'Failed to calculate AI Match Score', error: error.message });
  }
};

/**
 * Handle Live AI Mock Interview Session
 * POST /api/ai/live-interview/:internshipId
 */
export const postLiveInterview = async (req, res, next) => {
  try {
    const { internshipId } = req.params;
    const { message, history } = req.body;
    const userId = req.user._id;

    if (!message) return res.status(400).json({ message: 'Message is required' });

    const [user, internship] = await Promise.all([
      User.findById(userId).select('skills keywords'),
      Internship.findById(internshipId).select('title description company'),
    ]);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY') {
      throw new Error('GEMINI_API_KEY is not configured or using placeholder');
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // System instruction to act strictly as an interviewer
      const systemInstruction = `
        You are an elite technical interviewer at ${internship.company} hiring for the "${internship.title}" role.
        You are conducting a live interview with a candidate.
        Job Description: ${internship.description}
        Candidate Skills: ${user.skills.join(', ')}

        RULES:
        1. Ask exactly ONE question at a time.
        2. If this is the start of the interview (history is empty), greet them, state the role, and ask the first question.
        3. Wait for their answer. Evaluate their answer briefly before asking the NEXT question based on the job description.
        4. After you have asked 5 questions total, conclude the interview. Provide a final Scorecard (out of 100) and actionable feedback. Do NOT ask a 6th question.
        5. Act strictly as a demanding but professional interviewer. Be concise.
      `;

      // Map frontend history to Gemini format
      // Filter out any system markers if needed, ensure alternating user/model
      const formattedHistory = history.map(h => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.content }],
      }));

      const chat = model.startChat({
        history: formattedHistory,
        generationConfig: { maxOutputTokens: 800 },
      });

      // Send the system instruction context if it's the very first message
      let fullMessage = message;
      if (history.length === 0) {
        fullMessage = `SYSTEM INSTRUCTION: ${systemInstruction}\n\nCandidate says: ${message}`;
      }

      const result = await chat.sendMessage(fullMessage);
      const responseText = result.response.text();

      res.json({
        role: 'assistant',
        content: responseText
      });
    } catch (error) {
      // INTERVIEW FALLBACK (Demo Mode)
      if (history.length === 0) {
        return res.json({
          role: 'assistant',
          content: `[DEMO MODE] Hello! I'm your SmartED Technical Interviewer. Since we're in demo mode, let's start with a core question about your experience with ${user.skills[0] || 'Technical Projects'}. How have you used this skill to solve a real-world problem?`
        });
      }
      
      if (error.message?.includes('403') || error.message?.includes('API key not valid')) {
        return res.status(500).json({ message: 'Your GEMINI_API_KEY appears to be invalid. Please check your .env file.' });
      }
      if (error.message?.includes('404') || error.message?.includes('model not found')) {
        return res.status(500).json({ message: 'The AI model "gemini-1.5-flash" was not found for this key.' });
      }
      throw error;
    }
  } catch (error) {
    console.error('Live Interview Error:', error);
    res.status(500).json({ message: error.message || 'Interview connection interrupted. Try again.' });
  }
};
