import { GoogleGenAI } from "@google/genai";

import {
  AIRequest,
  AIResponse,
} from "../types";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function askGemini<T>(
  request: AIRequest
): Promise<AIResponse<T>> {
  try {
    const response =
      await ai.models.generateContent({
        model: "gemini-3-flash-preview",

        contents: `
${request.systemPrompt}

${request.userPrompt}
`,
      });

    const text = response.text;

    if (!text) {
      throw new Error("No response from Gemini.");
    }

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return {
      success: true,
      data: JSON.parse(cleaned),
    };
  } catch (error) {
    console.error("Gemini Error:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown Gemini error",
    };
  }
}