
"use server";

import { createClient } from "@/lib/supabase/server";
import { generateEmbedding, generateAnswer } from "@/lib/gemini";

// 1. Define the search result interface to satisfy TypeScript
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
    // 2. Generate embedding (768-dim)
    const queryEmbedding = await generateEmbedding(query);

    // 3. Search Supabase (With Strict Type Casting)
    // We cast the RPC call params to 'any' and the return to our interface + error
    const { data: matchedNotes, error } = (await supabase.rpc("match_notes", {
      query_embedding: queryEmbedding,
      match_threshold: 0.5,
      match_count: 5,
      user_id_input: user.id
    } as any)) as { data: MatchNoteResult[] | null; error: any };

    if (error) {
      console.error("Vector Search Error:", error);
      return "I had trouble accessing your memory bank.";
    }

    if (!matchedNotes || matchedNotes.length === 0) {
      return "I couldn't find any relevant notes in your brain to answer that.";
    }

    // 4. Prepare Context for Gemini
    const contextText = matchedNotes
      .map((note) => `Note: ${note.content}`)
      .join("\n\n");

    // 5. Generate Answer
    const answer = await generateAnswer(query, contextText);
    return answer;

  } catch (error) {
    console.error("Ask Brain Action Error:", error);
    return "The neural link is temporarily unstable. Please try again.";
  }
}