"use server";

import { createClient } from "@/lib/supabase/server";
import { generateEmbedding, generateAnswer } from "@/lib/gemini";

export async function askBrain(query: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return "Please log in to ask questions.";

  // 1. Turn user question into a vector
  const queryEmbedding = await generateEmbedding(query);

  // 2. Search Supabase for similar notes using the SQL function we made
  const { data: matchedNotes, error } = await supabase.rpc("match_notes", {
    query_embedding: queryEmbedding,
    match_threshold: 0.5, // Similarity threshold (0 to 1)
    match_count: 5,       // Retrieve top 5 most relevant notes
    user_id_input: user.id
  });

  if (error) {
    console.error("Vector Search Error:", error);
    return "I had trouble accessing your memory bank.";
  }

  if (!matchedNotes || matchedNotes.length === 0) {
    return "I couldn't find any relevant notes in your brain to answer that.";
  }

  // 3. Prepare Context for Gemini
  const contextText = matchedNotes
    .map((note: any) => `Note: ${note.content}`)
    .join("\n\n");

  // 4. Generate Answer using RAG
  const answer = await generateAnswer(query, contextText);
  
  return answer;
}