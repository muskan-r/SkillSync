import { GoogleGenAI } from "@google/genai";

export const generateAIResponse = async (prompt, retries = 2) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });
      return response.text;
    } catch (error) {
      const isOverloaded = error.message?.includes("UNAVAILABLE") || error.message?.includes("high demand");
      if (isOverloaded && attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, 1500 * (attempt + 1)));
        continue;
      }
      console.error("AI Service Error:", error.message);
      throw new Error(
        isOverloaded
          ? "AI service is temporarily busy. Please try again in a moment."
          : "Failed to generate AI response"
      );
    }
  }
};