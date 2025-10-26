import { GoogleGenAI, Type } from "@google/genai";
import type { Force } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const solveProblemStepByStep = async (problem: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `أنت مدرس فيزياء خبير. سيقدم المستخدم مسألة فيزياء. قم بحل المسألة وقدم الحل على شكل خطوات واضحة ومرقمة وسهلة المتابعة باللغة العربية. المسألة هي: "${problem}"`,
        });
        return response.text;
    } catch (error) {
        console.error("Error solving problem:", error);
        throw new Error("فشل في حل المسألة. الرجاء المحاولة مرة أخرى.");
    }
};


const forceSchema = {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING, description: "اسم القوة (مثل: الجاذبية, القوة العمودية)" },
      direction: { type: Type.STRING, description: "اتجاه القوة ('up', 'down', 'left', 'right', 'angled')" },
      description: { type: Type.STRING, description: "وصف موجز للقوة." },
    },
    required: ["name", "direction", "description"],
  };

export const analyzeForces = async (scenario: string, imageBase64: string | null): Promise<Force[]> => {
    try {
        const textPart = { text: `أنت خبير فيزياء. قم بتحليل القوى المؤثرة على الجسم في السيناريو و/أو الصورة التالية ووصفها باللغة العربية. السيناريو هو: "${scenario}".` };
        const parts: any[] = [textPart];

        if (imageBase64) {
            const [header, data] = imageBase64.split(',');
            const mimeType = header.match(/:(.*?);/)?.[1];

            if (mimeType && data) {
                parts.unshift({ // Add image first
                    inlineData: {
                        mimeType: mimeType,
                        data: data,
                    },
                });
            }
        }

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                  type: Type.ARRAY,
                  items: forceSchema,
                },
            },
        });
        
        const jsonText = response.text.trim();
        const forces = JSON.parse(jsonText);

        if (!Array.isArray(forces)) {
            throw new Error("Invalid response format from API. Expected an array of forces.");
        }
        
        return forces;
    } catch (error) {
        console.error("Error analyzing forces:", error);
        throw new Error("فشل في تحليل القوى. الرجاء المحاولة مرة أخرى.");
    }
};