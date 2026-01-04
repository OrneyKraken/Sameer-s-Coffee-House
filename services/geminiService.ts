
import { GoogleGenAI, Type } from "@google/genai";
import { MenuItem } from "../types";

/**
 * Gets a coffee recommendation based on user mood using provided menu items.
 */
export const getCoffeeRecommendation = async (userMood: string, menuItems: MenuItem[]) => {
  // Always use direct initialization with process.env.API_KEY as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Based on the following menu items, recommend one perfect coffee for a customer who is feeling: "${userMood}". 
    Menu Items: ${JSON.stringify(menuItems.map(m => ({ name: m.name, tags: m.tags })))}
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

  // response.text is a property, not a method
  return JSON.parse(response.text || '{}');
};

/**
 * Handles chat interactions with the digital barista using context-aware menu data.
 */
export const baristaChat = async (history: {role: 'user' | 'model', text: string}[], message: string, menuItems: MenuItem[]) => {
  // Always use direct initialization with process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are the friendly and knowledgeable head barista at "Sameer's Coffee Shop". 
      Your tone is warm, professional, and slightly poetic about coffee. 
      You know everything about the menu: ${JSON.stringify(menuItems)}.
      If asked for recommendations, use the items from our menu.
      Keep responses concise but engaging.`,
    }
  });

  // Send the message using the stateful chat session
  const response = await chat.sendMessage({ message });
  // response.text is a property, not a method
  return response.text || "I'm sorry, I'm a bit busy with a latte right now. Can you try again?";
};
