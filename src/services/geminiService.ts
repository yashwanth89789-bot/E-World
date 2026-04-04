import { GoogleGenAI, Type } from "@google/genai";
import { NewsArticle } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function fetchGlobalNews(): Promise<NewsArticle[]> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Find the top 10 most significant global news stories happening right now. For each story, provide a title, a brief summary, the specific city or region it's occurring in, its approximate latitude and longitude, and a category (e.g., Politics, Tech, Climate, Conflict, Economy).",
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              summary: { type: Type.STRING },
              location: {
                type: Type.OBJECT,
                properties: {
                  lat: { type: Type.NUMBER },
                  lng: { type: Type.NUMBER },
                  name: { type: Type.STRING }
                },
                required: ["lat", "lng", "name"]
              },
              category: { type: Type.STRING },
              timestamp: { type: Type.STRING }
            },
            required: ["title", "summary", "location", "category"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    
    const articles = JSON.parse(text);
    return articles.map((a: any, index: number) => ({
      ...a,
      id: a.id || `news-${index}-${Date.now()}`,
      timestamp: a.timestamp || new Date().toISOString()
    }));
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}

export async function getPlaceDetails(locationName: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide details and context for the location: ${locationName}. Include interesting facts or current situation.`,
      config: {
        tools: [{ googleMaps: {} }]
      }
    });
    
    return {
      text: response.text,
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Error fetching place details:", error);
    return null;
  }
}
