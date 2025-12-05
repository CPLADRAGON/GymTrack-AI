import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
// This key is injected via Vite 'define' from GitHub Secrets during build
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const askGeminiCoach = async (
  userQuery: string,
  context: string
): Promise<string> => {
  if (!process.env.API_KEY) {
    return "系统配置错误：API Key 未配置。请检查 GitHub Secrets (VITE_API_KEY)。";
  }

  try {
    const systemInstruction = `
      You are an expert fitness coach specializing in bodybuilding and strength training.
      The user is following a 4-Day Upper/Lower split.
      Provide concise, actionable advice, cues, or motivation.
      IMPORTANT: You must reply in Simplified Chinese (简体中文).
    `;

    const prompt = `
      Context (Current Workout Plan): ${context}
      User Question: ${userQuery}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    return response.text || "抱歉，我现在无法回答。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 服务暂时不可用，请稍后再试。";
  }
};