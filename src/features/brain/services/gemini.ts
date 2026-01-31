import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function generateNoteMetadata(content: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    // We ask Gemini to return strictly formatted JSON
    const prompt = `
      Analyze the following note content. 
      1. Generate a short title (max 5 words).
      2. Generate a 1-sentence summary.
      3. Extract 3-5 relevant tags (keywords).
      4. Return the result ONLY as a valid JSON object with keys: "title", "summary", "tags".
      
      Note Content:
      "${content.substring(0, 5000)}"
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up the response (sometimes AI adds markdown code blocks)
    const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("AI Generation Error:", error);
    // Fallback if AI fails (so the app doesn't crash)
    return {
      title: "Untitled Note",
      summary: content.substring(0, 100) + "...",
      tags: ["note"]
    };
  }
}