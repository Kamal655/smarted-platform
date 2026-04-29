import { GoogleGenerativeAI } from '@google/generative-ai';
import Internship from '../models/Internship.js';
import User from '../models/User.js';

/**
 * Process Chat - AI-Powered Assistant
 * ─────────────────────────────────────────────
 * Uses Gemini API if available, otherwise falls back to a 
 * sophisticated rule-based matching system.
 */
export const processChat = async (req, res, next) => {
  try {
    const { message, history = [] } = req.body;
    const userId = req.user._id;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // 1. Gather Context (User Profile + Open Internships)
    const [user, internships] = await Promise.all([
      User.findById(userId).select('name skills keywords education isProfileAnalyzed'),
      Internship.find({ status: 'Open' }).limit(5).lean(),
    ]);

    const context = {
      userName: user?.name || 'Student',
      userSkills: user?.skills || [],
      isProfileAnalyzed: user?.isProfileAnalyzed || false,
      availableInternships: internships.map(i => ({
        title: i.title,
        company: i.company,
        location: i.location,
        stipend: i.stipend
      }))
    };

    // 2. Try Gemini AI
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const systemPrompt = `
          You are "InternFlow Assistant", a helpful AI for the InternSpace platform.
          You help students with:
          1. Internship suggestions based on their skills.
          2. Resume improvement tips.
          3. General career guidance.

          CURRENT USER CONTEXT:
          - Name: ${context.userName}
          - Skills: ${context.userSkills.join(', ') || 'No skills added yet'}
          - Profile Analyzed: ${context.isProfileAnalyzed ? 'Yes' : 'No (Advise them to upload resume)'}

          AVAILABLE INTERNSHIPS (TOP 5):
          ${JSON.stringify(context.availableInternships, null, 2)}

          GUIDELINES:
          - Be professional, encouraging, and concise.
          - If they ask for internships, suggest from the list above that match their skills.
          - If their profile isn't analyzed, suggest they visit the "Resume Analyzer" page.
          - Use bullet points for lists.
          - Do NOT make up internships not in the provided list.
        `;

        const chat = model.startChat({
          history: history.map(h => ({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.content }],
          })),
          generationConfig: { maxOutputTokens: 500 },
        });

        const result = await chat.sendMessage(systemPrompt + "\n\nUser Question: " + message);
        const responseText = result.response.text();

        return res.json({
          role: 'assistant',
          content: responseText,
          source: 'AI'
        });
      } catch (aiError) {
        console.error('Gemini API Error:', aiError);
        // Continue to fallback
      }
    }

    // 3. Fallback: Rule-Based Engine
    let response = "I'm here to help! ";
    const lowerMsg = message.toLowerCase();

    if (lowerMsg.includes('internship') || lowerMsg.includes('suggest') || lowerMsg.includes('jobs')) {
      if (context.availableInternships.length > 0) {
        response += `I found some interesting internships for you:\n\n` +
          context.availableInternships.map(i => `• **${i.title}** at ${i.company} (${i.location})`).join('\n') +
          `\n\nYou can find more in the "Internships" tab.`;
      } else {
        response += "Currently, there are no open internships. Check back soon!";
      }
    } else if (lowerMsg.includes('resume') || lowerMsg.includes('cv') || lowerMsg.includes('improve')) {
      response += `Here are some tips for your resume:\n\n` +
        `• Ensure your contact information is up to date.\n` +
        `• List your technical skills clearly.\n` +
        `${!context.isProfileAnalyzed ? '• **Try our Resume Analyzer!** Upload your PDF to see how you match with jobs.\n' : ''}` +
        `• Link to your GitHub or Portfolio for better visibility.`;
    } else if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
      response += `Hi ${context.userName}! How can I assist with your career today? You can ask me about internships, resume tips, or career advice.`;
    } else {
      response += "That's a great question. While I'm still learning, I can definitely help you find internships or improve your profile. Try asking 'What internships are available?' or 'How can I improve my resume?'";
    }

    res.json({
      role: 'assistant',
      content: response,
      source: 'Fallback'
    });

  } catch (error) {
    next(error);
  }
};
