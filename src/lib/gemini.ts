import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
if (!apiKey) throw new Error("Missing API Key");

const genAI = new GoogleGenerativeAI(apiKey);

// ADD THIS LOG TO VERIFY
console.log("DEBUG: Using gemini.ts from src/lib/");

// Use 'gemini-pro' as it's the most stable for v1beta
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

// Embedding model for vector search
const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });

export async function generateEmbedding(text: string) {
  const result = await embeddingModel.embedContent(text);
  return result.embedding.values;
}

export async function generateNoteMetadata(content: string) {
  const prompt = `Analyze this note and return JSON: { "title": "...", "type": "idea|snippet|article|journal", "tags": [], "summary": "..." } \n\n Content: ${content}`;

  // This is line 26 in the error trace
  const result = await model.generateContent(prompt);
  const response = result.response.text();
  
  const cleanedResponse = response.replace(/```json/g, "").replace(/```/g, "").trim();
  return JSON.parse(cleanedResponse);
}

export async function generateAnswer(query: string, context: string) {
  const prompt = `Context: ${context} \n\n Question: ${query}`;
  const result = await model.generateContent(prompt);
  return result.response.text();
}