import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { BusinessCardData } from "../types";

// Helper function for the API key check for Veo models, adapted for general use if needed.
// For `gemini-2.5-flash-image`, we don't strictly need this, but it's good to keep the pattern
// for potential future use cases involving models that require explicit key selection.
const ensureApiKeySelected = async () => {
  if (typeof window.aistudio !== 'undefined' && typeof window.aistudio.hasSelectedApiKey === 'function') {
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      console.warn("API Key not selected. Opening key selection dialog.");
      await window.aistudio.openSelectKey();
      // Assume key selection was successful to avoid race conditions.
    }
  }
};

export const extractBusinessCardData = async (
  base64ImageData: string,
): Promise<BusinessCardData> => {
  // Ensure an API key is selected, though for `gemini-2.5-flash-image` it's often implicit
  // through the environment variable. This is more critical for Veo models.
  await ensureApiKeySelected();

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg', // Assuming JPEG. Could be dynamic based on file type.
      data: base64ImageData,
    },
  };

  const textPart = {
    text: `Extract the following information from this business card image and return it as a JSON object:
    - Name (Tên)
    - Title (Chức vụ)
    - Company (Công ty)
    - Phone Number (Số điện thoại)
    - Email (Email)

    Ensure the keys in the JSON object are 'name', 'title', 'company', 'phone', and 'email'.
    If a field is not found, return an empty string for that field.
    The response must be a pure JSON object, without any Markdown formatting or extra text outside the JSON.`,
  };

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [imagePart, textPart] },
    });

    let jsonStr = response.text.trim();

    // Remove markdown code block if present
    if (jsonStr.startsWith('```json')) {
      jsonStr = jsonStr.substring('```json'.length);
    }
    if (jsonStr.endsWith('```')) {
      jsonStr = jsonStr.substring(0, jsonStr.length - '```'.length);
    }
    jsonStr = jsonStr.trim(); // Trim again after removing markdown

    return JSON.parse(jsonStr) as BusinessCardData;
  } catch (error: any) {
    if (error.message && error.message.includes("Requested entity was not found.")) {
      console.error("API Key might be invalid or not selected. Please select a valid API key.");
      if (typeof window.aistudio !== 'undefined' && typeof window.aistudio.openSelectKey === 'function') {
        await window.aistudio.openSelectKey();
      }
      throw new Error("Failed to extract data: Invalid API key or service issue.");
    }
    console.error("Error extracting business card data:", error);
    throw new Error(`Failed to extract business card data: ${error.message || "Unknown error"}`);
  }
};