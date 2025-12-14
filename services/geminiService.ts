import { GoogleGenAI, Type } from "@google/genai";
import { AiSuggestion } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAiRecommendation = async (
  currentMenu: string[],
  userPreference?: string
): Promise<AiSuggestion> => {
  try {
    const modelId = "gemini-2.5-flash";
    
    const prompt = userPreference 
      ? `用户想吃：${userPreference}。请从以下菜单中选择最合适的一道菜，或者如果菜单里没有合适的，推荐一道菜单外的新菜。菜单列表：${currentMenu.join(', ')}。请用幽默风趣的语气解释原因。`
      : `请从以下菜单中随机推荐一道菜，并给出一个无法拒绝的理由（可以是幽默的、天气的、心情的理由）。菜单列表：${currentMenu.join(', ')}。`;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Recommended dish name" },
            reason: { type: Type.STRING, description: "Reason for recommendation" }
          },
          required: ["name", "reason"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return result as AiSuggestion;

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback if API fails
    return {
      name: "西北风",
      reason: "AI 似乎饿晕了，暂时无法思考。不如喝点西北风冷静一下？"
    };
  }
};

export const generateNewDishes = async (
  existingDishes: string[],
  count: number = 5
): Promise<string[]> => {
    try {
        const modelId = "gemini-2.5-flash";
        const prompt = `请推荐 ${count} 个这一列表中没有的常见中国午餐或晚餐菜品名称。只返回菜名数组。现有列表：${existingDishes.slice(0, 20).join(', ')}...`;

        const response = await ai.models.generateContent({
            model: modelId,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                }
            }
        });
        
        const result = JSON.parse(response.text || "[]");
        return result as string[];
    } catch (error) {
        console.error("Gemini API Error:", error);
        return ["红烧肉", "糖醋排骨", "宫保鸡丁", "鱼香肉丝", "水煮鱼"];
    }
}
