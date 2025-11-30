import { GoogleGenAI } from "@google/genai";

export const callGemini = async (
  apiKey: string,
  model: string,
  systemPrompt: string,
  userPrompt: string,
  maxTokens: number,
  temperature: number
): Promise<string> => {
  if (!apiKey) throw new Error("Gemini API Key is missing");

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        maxOutputTokens: maxTokens,
        temperature: temperature,
      }
    });
    
    return response.text || "No response generated.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Gemini API failed");
  }
};