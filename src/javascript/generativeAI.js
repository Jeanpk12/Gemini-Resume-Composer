import { GoogleGenerativeAI, HarmCategory } from "@google/generative-ai";

const API_KEY = "AIzaSyAlHdUZg9DOADi5SBJmR5f-ocO-1TEXAEs";
const genAI = new GoogleGenerativeAI(API_KEY);

export async function initializeGenerativeAI() {
    return await genAI.getGenerativeModel({ 
        model: "gemini-pro",
        safetySettings: {
            [HarmCategory.HARM_CATEGORY_HARASSMENT]: "BLOCK_NONE",
            [HarmCategory.HARM_CATEGORY_HATE_SPEECH]: "BLOCK_NONE",
            [HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT]: "BLOCK_NONE",
            [HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT]: "BLOCK_NONE",
        }
    }).startChat({
        generationConfig: {
            maxOutputTokens: 30000,
            temperature: 1,
            topP: 1,
            topK: 16,
        },
    });
}
