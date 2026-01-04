
import { GoogleGenAI, Type } from "@google/genai";
import { MENU_ITEMS } from "../constants";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getCoffeeRecommendation = async (userMood: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Based on the following menu items, recommend one perfect coffee for a customer who is feeling: "${userMood}". 
    Menu Items: ${JSON.stringify(MENU_ITEMS.map(m => ({ name: m.name, tags: m.tags })))}
    Provide your response as a JSON object with 'name' (exactly as it appears in the menu), 'reason' (why it fits their mood), and 'tip' (a barista tip for this drink).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          reason: { type: Type.STRING },
          tip: { type: Type.STRING }
        },
        required: ["name", "reason", "tip"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const baristaChat = async (history: {role: 'user' | 'model', text: string}[], message: string) => {
  const ai = getAI();
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are the friendly and knowledgeable head barista at "Sameer's Coffee Shop". 
      Your tone is warm, professional, and slightly poetic about coffee. 
      You know everything about the menu: ${JSON.stringify(MENU_ITEMS)}.
      If asked for recommendations, use the items from our menu.
      Keep responses concise but engaging.`,
    }
  });

  // Reconstruct chat history if needed, though simple prompt often works best for small SPAs
  const response = await chat.sendMessage({ message });
  return response.text || "I'm sorry, I'm a bit busy with a latte right now. Can you try again?";
};
