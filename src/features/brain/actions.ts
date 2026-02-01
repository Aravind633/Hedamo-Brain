"use server";

import { createClient } from "@/lib/supabase/server";
import { generateEmbedding, generateAnswer } from "@/lib/gemini";

/**
 * 🧠 Ask Brain (RAG Implementation)
 * This server action performs a vector search on Supabase and 
 * uses Gemini to answer questions based on your personal notes.
 */
export async function askBrain(query: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return "Please log in to ask questions.";

  try {
    // 1. Generate embedding for the user's query (768-dim)
    const queryEmbedding = await generateEmbedding(query);

    // 2. Search Supabase for similar notes using the SQL function
    // ✅ 'as any' cast bypasses the Supabase type mismatch during build
    const { data: matchedNotes, error } = await supabase.rpc("match_notes", {
      query_embedding: queryEmbedding,
      match_threshold: 0.5, // Similarity threshold (0 to 1)
      match_count: 5,       // Retrieve top 5 most relevant notes
      user_id_input: user.id
    } as any);

    if (error) {
      console.error("Vector Search Error:", error);
      return "I had trouble accessing your memory bank.";
    }

    if (!matchedNotes || matchedNotes.length === 0) {
      return "I couldn't find any relevant notes in your brain to answer that.";
    }

    // 3. Prepare Context for Gemini (RAG pattern)
    const contextText = matchedNotes
      .map((note: any) => `Note: ${note.content}`)
      .join("\n\n");

    // 4. Generate Answer using the Gemini model
    const answer = await generateAnswer(query, contextText);
    
    return answer;

  } catch (error) {
    console.error("Ask Brain Action Error:", error);
    return "The neural link is temporarily unstable. Please try again.";
  }
}