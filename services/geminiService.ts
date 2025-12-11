import { GoogleGenAI, Chat, Type } from '@google/genai';
import { Message } from '../types';

let ai: GoogleGenAI | null = null;

const getAI = () => {
  if (!ai) {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set");
    }
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

export const createChatSession = (history: Message[], systemInstruction: string): Chat => {
  const aiInstance = getAI();
  
  const formattedHistory = history.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.text }]
  }));

  return aiInstance.chats.create({
    model: 'gemini-2.5-flash',
    history: formattedHistory,
    config: {
      systemInstruction: systemInstruction,
    }
  });
};

export const generateDiscussionPoints = async (articleContent: string): Promise<{ title: string; questions: string[] }> => {
  const aiInstance = getAI();
  const model = 'gemini-2.5-flash';
  
  const response = await aiInstance.models.generateContent({
    model,
    contents: `Based on the following article, please generate a concise, engaging title and three thought-provoking discussion questions to facilitate a Socratic dialogue.

ARTICLE:
---
${articleContent.substring(0, 20000)}
---

Provide your response in JSON format.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: {
            type: Type.STRING,
            description: "A concise, engaging title for the article.",
          },
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING,
            },
            description: "An array of three thought-provoking discussion questions.",
          },
        },
        required: ["title", "questions"],
      },
    },
  });

  try {
    const jsonString = response.text.trim();
    if (jsonString.startsWith('{') && jsonString.endsWith('}')) {
       return JSON.parse(jsonString);
    }
    throw new Error("Failed to parse JSON response from AI. Response was not a valid JSON object.");
  } catch (e) {
    console.error("Error parsing discussion points JSON:", e);
    // Provide a fallback so the app doesn't crash
    return {
      title: "Title Could Not Be Generated",
      questions: ["What is the main argument of the article?", "What evidence does the author provide?", "What are the potential implications of the author's conclusions?"]
    };
  }
};
