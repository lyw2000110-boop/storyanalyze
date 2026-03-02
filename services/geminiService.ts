
import { GoogleGenAI, Type } from "@google/genai";
import { StoryAnalysis, Adaptation } from "../types";

const API_KEY = process.env.API_KEY || "";

export const analyzeManuscript = async (text: string): Promise<StoryAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `请作为一名资深文学分析师，分析以下故事文本，并以中文提取结构化信息。
特别要求：对于每个人物，请准确判断其性别、年龄段以及是否为人类。如果性别不详或非生物，请标注为“未知”。

请严格按照以下 JSON 结构返回，确保内容专业且逻辑严密。

TEXT:\n${text.substring(0, 30000)}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "故事标题" },
          characters: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING, description: "姓名" },
                role: { type: Type.STRING, description: "身份/角色" },
                gender: { type: Type.STRING, enum: ["男", "女", "未知"] },
                ageRange: { type: Type.STRING, enum: ["少儿", "青年", "中年", "老年"] },
                isHuman: { type: Type.BOOLEAN, description: "是否为人类" },
                appearance: { type: Type.STRING, description: "外貌细节" },
                personality: { type: Type.STRING, description: "性格特征" },
                bio: { type: Type.STRING, description: "生平小传" },
                avatarSeed: { type: Type.STRING, description: "随机唯一识别码" }
              },
              required: ["id", "name", "role", "gender", "ageRange", "isHuman", "appearance", "personality", "bio", "avatarSeed"]
            }
          },
          outline: {
            type: Type.OBJECT,
            properties: {
              storySummary: { type: Type.STRING },
              chapters: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    title: { type: Type.STRING },
                    summary: { type: Type.STRING }
                  },
                  required: ["id", "title", "summary"]
                }
              }
            },
            required: ["storySummary", "chapters"]
          },
          inspiration: {
            type: Type.OBJECT,
            properties: {
              innovations: { type: Type.ARRAY, items: { type: Type.STRING } },
              settings: { type: Type.ARRAY, items: { type: Type.STRING } },
              terms: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    description: { type: Type.STRING }
                  },
                  required: ["name", "description"]
                }
              },
              concepts: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["innovations", "settings", "terms", "concepts"]
          }
        },
        required: ["title", "characters", "outline", "inspiration"]
      }
    }
  });

  if (!response.text) {
    throw new Error("AI_RESPONSE_EMPTY");
  }

  return JSON.parse(response.text.trim());
};

export const generateAdaptation = async (analysis: StoryAnalysis): Promise<Adaptation> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `请作为一名资深文学策划，基于以下故事分析结果，进行“同类仿写”分析。
提取原件中的核心设定和精华内核，并基于此提供3-5个同类型故事或流行梗的改写思路，为创作者提供灵感。

故事标题：${analysis.title}
故事梗概：${analysis.outline.storySummary}
核心创新：${analysis.inspiration.innovations.join(', ')}

请严格按照以下 JSON 结构返回：`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          essence: { type: Type.STRING, description: "提取的故事内核与精华设定" },
          rewrites: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: "改写后的故事标题或梗概名称" },
                concept: { type: Type.STRING, description: "改写思路/核心梗" },
                rewrite: { type: Type.STRING, description: "具体的改写内容或灵感片段" }
              },
              required: ["title", "concept", "rewrite"]
            }
          }
        },
        required: ["essence", "rewrites"]
      }
    }
  });

  if (!response.text) {
    throw new Error("AI_RESPONSE_EMPTY");
  }

  return JSON.parse(response.text.trim());
};
