import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// 1. Generate Embedding (Vector) for Search
export async function generateEmbedding(text: string) {
  const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
  const result = await model.embedContent(text);
  return result.embedding.values;
}

// 2. Generate Summary & Tags
export async function generateNoteMetadata(content: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const prompt = `
    Analyze this note content: "${content.substring(0, 1000)}..."
    
    Return a JSON object with:
    1. "summary": A concise 1-sentence summary.
    2. "tags": An array of 3-5 relevant short tags (lowercase).
    
    Output strictly valid JSON.
  `;

  const result = await model.generateContent(prompt);
  const response = result.response.text();
  
  try {
    // Clean up markdown formatting if Gemini adds it
    const cleanJson = response.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (e) {
    console.error("AI Parse Error:", e);
    return { summary: "No summary available", tags: [] };
  }
}

// 3. RAG Chat (Ask Questions)
export async function generateAnswer(query: string, context: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const prompt = `
    You are a helpful "Second Brain" assistant. Answer the user's question based ONLY on the provided context notes.
    
    Context Notes:
    ${context}
    
    User Question: ${query}
    
    Answer concisely. If the context doesn't have the answer, say "I don't have that information in your brain yet."
  `;

  const result = await model.generateContent(prompt);
  return result.response.text();
}