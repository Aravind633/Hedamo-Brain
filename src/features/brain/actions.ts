"use server";

import { createClient } from "@/lib/supabase/server";
import { generateEmbedding, generateAnswer } from "@/lib/gemini";

// 1. Define the search result interface
interface MatchNoteResult {
  id: string;
  title: string;
  content: string;
  type: string;
  similarity: number;
}

export async function askBrain(query: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return "Please log in to ask questions.";

  try {
    const queryEmbedding = await generateEmbedding(query);

    // 2. Cast the RPC response to our new interface
    const { data: matchedNotes, error } = await supabase.rpc("match_notes", {
      query_embedding: queryEmbedding,
      match_threshold: 0.5,
      match_count: 5,
      user_id_input: user.id
    } as any) as { data: MatchNoteResult[] | null }; // 👈 Add this type cast

    if (error) {
      console.error("Vector Search Error:", error);
      return "I had trouble accessing your memory bank.";
    }

    // 3. This will now pass TypeScript validation
    if (!matchedNotes || matchedNotes.length === 0) {
      return "I couldn't find any relevant notes in your brain to answer that.";
    }

    const contextText = matchedNotes
      .map((note) => `Note: ${note.content}`)
      .join("\n\n");

    const answer = await generateAnswer(query, contextText);
    return answer;

  } catch (error) {
    console.error("Ask Brain Action Error:", error);
    return "The neural link is temporarily unstable. Please try again.";
  }
}