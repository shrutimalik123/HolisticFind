import { GoogleGenAI } from "@google/genai";
import { Coordinates, SearchResult } from "../types";

const apiKey = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey });

export const searchProviders = async (
  query: string,
  location?: Coordinates
): Promise<SearchResult> => {
  try {
    const model = "gemini-2.5-flash";
    
    // Construct tool configuration
    const tools: any[] = [{ googleMaps: {} }];
    const toolConfig: any = {};

    if (location) {
      toolConfig.retrievalConfig = {
        latLng: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
      };
    }

    const contents = `
      Find highly-rated holistic health providers matching this request: "${query}".
      
      Focus on these categories: Acupuncturists, Naturopaths, Nutritionists, Massage Therapists, and Functional Medicine Doctors.
      
      Please provide a helpful summary of the top results found via Google Maps. 
      For each provider you mention, include:
      1. What they specialize in.
      2. Any notable rating or review snippet available.
      3. Why they might be a good fit.

      Keep the tone professional, calming, and trustworthy.
    `;

    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        tools,
        toolConfig: Object.keys(toolConfig).length > 0 ? toolConfig : undefined,
      },
    });

    const text = response.text || "No detailed information found.";
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata as any; // Cast to any to avoid strict type issues with SDK versions, handled by our types.ts

    return {
      text,
      groundingMetadata,
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to fetch providers. Please try again.");
  }
};