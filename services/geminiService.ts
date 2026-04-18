
import { GoogleGenAI, Chat, GenerateContentResponse, Type } from "@google/genai";
import { Language, DailyDrop } from "../types.js";

// Helper to statically resolve environment variables for Vite/Vercel
const getGeminiApiKey = () => {
  // 1. Static Vite Context (requires explicit string paths for bundler replacement)
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    // @ts-ignore
    if (import.meta.env.VITE_API_KEY) return import.meta.env.VITE_API_KEY;
    // @ts-ignore
    if (import.meta.env.VITE_GEMINI_API_KEY) return import.meta.env.VITE_GEMINI_API_KEY;
  }
  
  // 2. Node.js Context (Serverless / Express)
  if (typeof process !== 'undefined' && process.env) {
    if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
    if (process.env.VITE_GEMINI_API_KEY) return process.env.VITE_GEMINI_API_KEY;
    if (process.env.API_KEY) return process.env.API_KEY;
    if (process.env.VITE_API_KEY) return process.env.VITE_API_KEY;
  }
  
  return undefined;
};

let genAI: GoogleGenAI | null = null;
const getGenAI = () => {
  if (!genAI) {
    const API_KEY = getGeminiApiKey();
    if (!API_KEY) {
      console.warn("Gemini API Key is missing. AI features may fail.");
    }
    // IMPORTANT: GoogleGenAI requires an object with the apiKey property
    genAI = new GoogleGenAI({ apiKey: API_KEY || "DUMMY_KEY_PREVENTS_CRASH" });
  }
  return genAI;
};

export const getPersonalizedGuidance = async (language: Language, goals: string[]): Promise<string> => {
    const ai = getGenAI();
    const prompt = `
      You are Bhante Bodhi, a Theravada Monk. 
      The user has chosen the following goals for their Buddhist practice: ${goals.join(', ')}.
      
      Suggest ONE specific next step for them to take in this app. 
      Refer to one of these sections: "Dhamma Classroom", "Meditation Hall", or "Sutta Explorer".
      Keep the tone gentle, encouraging, and brief (under 30 words).
      Language: ${language === 'si' ? 'Sinhala' : 'English'}.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });
        return response.text || "";
    } catch (e) {
        console.error("Guidance error", e);
        return "";
    }
};

export const createChatSession = (language: Language, userGoals: string[], isDebateMode: boolean = false): Chat => {
  const ai = getGenAI();
  let systemInstruction = `
    You are Bhante Bodhi, a wise, compassionate, and gentle Theravāda Buddhist monk.
    Your goal is to guide the user on their spiritual path.
    The user's goals are: ${userGoals.join(', ')}.
    
    Guidelines:
    1. Respond with reverence, clarity, and compassion.
    2. Base your answers on the Pali Canon (Tipitaka).
    3. Use simple metaphors where possible.
    4. If the user asks in Sinhala, respond in Sinhala. If in English, respond in English.
    5. Be non-judgmental and encouraging.
    6. Do not claim to be enlightened; speak as a humble guide.
    7. Current language preference of user: ${language === 'si' ? 'Sinhala' : 'English'}.
  `;

  if (isDebateMode) {
    systemInstruction = `
      You are participating in a Dhamma Debate. 
      You will play the role of a traditional Theravāda scholar monk.
      When the user presents a modern or conflicting viewpoint (e.g., secular Buddhism, eternalism, nihilism), 
      you will gently but firmly counter it using logic and references from the Suttas (Abhidhamma logic is permitted).
      Challenge the user to think deeper about intention (Chetana) and consequence (Kamma).
      Maintain respect but be intellectually rigorous. 
      Language: ${language === 'si' ? 'Sinhala' : 'English'}.
    `;
  }

  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: systemInstruction,
      thinkingConfig: { thinkingBudget: 0 } 
    },
  });
};

export const createSuttaChatSession = (language: Language): Chat => {
  const ai = getGenAI();
  const systemInstruction = `
    You are a specialized Sutta Navigator for the Pali Canon (Theravāda Tipitaka).
    Your goal is to help users find, explore, and understand specific suttas.
    
    Rules:
    1. PRIORITIZE citing specific Suttas (e.g., Dhammapada Verse X, Metta Sutta, Mahaparinibbana Sutta DN 16).
    2. If a user asks about a topic (e.g., "anger"), list relevant suttas and summarize what they say.
    3. Provide Pali terms where helpful, with translations.
    4. If the user asks general questions not related to finding/understanding scripture, politely suggest using the main "Ask a Monk" chat.
    5. Maintain a scholarly yet accessible tone.
    6. Language: ${language === 'si' ? 'Sinhala' : 'English'}.
  `;

  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: systemInstruction,
      thinkingConfig: { thinkingBudget: 0 }
    },
  });
};

export const generateDailyDharma = async (language: Language): Promise<DailyDrop> => {
  const ai = getGenAI();
  try {
    const prompt = language === 'si' 
      ? "Provide a short, inspiring quote from the Theravāda Buddhist Pali Canon in Sinhala, followed by its source (Sutta name), and a very brief 1-sentence reflection for daily life." 
      : "Provide a short, inspiring quote from the Theravāda Buddhist Pali Canon in English, followed by its source (Sutta name), and a very brief 1-sentence reflection for daily life.";

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                quote: { type: Type.STRING },
                source: { type: Type.STRING },
                reflection: { type: Type.STRING }
            },
            required: ["quote", "source", "reflection"]
        }
      }
    });

    const text = response.text;
    if (!text || !text.trim()) throw new Error("No content generated");
    
    const parsed = JSON.parse(text);
    return {
      quote: parsed.quote,
      source: parsed.source,
      reflection: parsed.reflection,
      timestamp: Date.now()
    };
  } catch (error) {
    console.error("Error generating daily dharma:", error);
    return getFallbackDailyDrop(language);
  }
};

const getFallbackDailyDrop = (language: Language): DailyDrop => {
  return {
    quote: language === 'si' 
      ? "සියලු සංස්කාර ධර්මයෝ නැසෙන සුලුය. අප්‍රමාදව කුසල් දහම්හි යෙදෙන්න." 
      : "All conditioned things are impermanent. Strive on with diligence.",
    source: "Mahaparinibbana Sutta (DN 16)",
    reflection: language === 'si' 
      ? "සෑම මොහොතක්ම අගනේය, එය යහපත සඳහා යොදවන්න." 
      : "Cherish every moment and use it to cultivate goodness.",
    timestamp: Date.now()
  };
};

export const getMeditationGuide = async (type: string, duration: number, language: Language): Promise<string> => {
    const ai = getGenAI();
    const prompt = `Write a short, calming introduction for a ${duration}-minute ${type} meditation session in ${language === 'si' ? 'Sinhala' : 'English'}. Keep it under 50 words.`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });
        return response.text || "Breathe in, breathe out. Relax your mind.";
    } catch (e) {
        return language === 'si' ? "සුවපහසු ඉරියව්වක් ගන්න. ඔබේ හුස්ම කෙරෙහි අවධානය යොමු කරන්න." : "Find a comfortable posture. Focus gently on your breath.";
    }
};

export const getLessonContent = async (topic: string, language: Language): Promise<string> => {
    const ai = getGenAI();
    const prompt = `Explain the Buddhist concept of "${topic}" for a beginner student. 
    Language: ${language === 'si' ? 'Sinhala' : 'English'}.
    Structure:
    1. Simple Definition
    2. Why it matters (suffering/happiness)
    3. A practical example.
    Keep it under 200 words. Format as Markdown.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });
        return response.text || "Content currently unavailable.";
    } catch (e) {
        return language === 'si' ? "තොරතුරු ලබා ගත නොහැක." : "Information unavailable.";
    }
};

export const getMeditationFeedback = async (reflection: string, language: Language): Promise<string> => {
    const ai = getGenAI();
    const prompt = `The user just finished meditation and wrote this reflection: "${reflection}". 
    Provide a brief, encouraging response (max 2 sentences) based on Theravada Buddhism. 
    Language: ${language === 'si' ? 'Sinhala' : 'English'}.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });
        return response.text || "Sadhu! Continue your practice.";
    } catch (e) {
        return "Sadhu! Sadhu! Sadhu!";
    }
};

export const askLessonQuestion = async (lessonTitle: string, question: string, language: Language): Promise<string> => {
    const ai = getGenAI();
    const prompt = `
      Context: The user is learning about "${lessonTitle}" in a Theravāda Buddhist app.
      User Question: "${question}"
      
      Task: Provide a clear, concise answer (max 3 sentences) based on the Pali Canon.
      Language: ${language === 'si' ? 'Sinhala' : 'English'}.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });
        return response.text || (language === 'si' ? "මට පිළිතුරු දීමට නොහැක." : "I cannot answer at this moment.");
    } catch (e) {
        return language === 'si' ? "තාක්ෂණික දෝෂයක්. පසුව උත්සාහ කරන්න." : "Connection error. Please try again.";
    }
};
