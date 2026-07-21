import { GoogleGenAI } from "@google/genai";

// Fix: Always use process.env.API_KEY directly when initializing the client as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generatePostContent = async (topic: string): Promise<string> => {
  if (!process.env.API_KEY) {
    console.warn("No API Key provided for Gemini");
    return `منشور تلقائي بواسطة الذكاء الاصطناعي عن: ${topic}. (يرجى تفعيل مفتاح API)`;
  }

  try {
    /* Fix: Updated model name to gemini-3-flash-preview as recommended for basic text tasks */
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `اكتب منشوراً قصيراً وجذاباً لمواقع التواصل الاجتماعي باللهجة العربية أو العربية الفصحى البسيطة حول: "${topic}". استخدم الإيموجي المناسب. اجعله أقل من 280 حرفاً.`,
    });
    
    // Accessing .text directly as per guidelines
    return response.text || "";
  } catch (error) {
    console.error("Gemini generation error:", error);
    return "عذراً، لا أستطيع التفكير في شيء الآن! 🤖";
  }
};