import { createClient } from "@supabase/supabase-js";
import { generateEmbedding, generateAnswer } from "@/lib/gemini";
import { NextResponse } from "next/server";


const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
);

export async function GET(request: Request) {
  // 1. Handle CORS (Allow public access)
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  

  const targetUserId = searchParams.get("userId") || "b7f9b9f5-77d3-44a5-8195-088548eff91f";

  if (!query) {
    return NextResponse.json({ error: "Missing 'query' parameter" }, { status: 400 });
  }

  try {
    // 3. Generate Vector for the query
    const queryEmbedding = await generateEmbedding(query);

    // 4. Search the Database (using admin client to bypass Auth)
    const { data: matchedNotes, error } = await supabaseAdmin.rpc("match_notes", {
      query_embedding: queryEmbedding,
      match_threshold: 0.5,
      match_count: 5,
      user_id_input: targetUserId // Search the specific user's brain
    });

    if (error) throw error;

    // 5. Generate Answer
    const contextText = matchedNotes?.map((n: any) => n.content).join("\n\n") || "";
    let answer = "No relevant information found in this brain.";
    
    if (contextText) {
      answer = await generateAnswer(query, contextText);
    }

    // 6. Return JSON Response
    return NextResponse.json({
      answer: answer,
      sources: matchedNotes?.map((note: any) => ({
        id: note.id,
        content: note.content.substring(0, 100), // snippet
        similarity: note.similarity
      }))
    }, {
      headers: {
        "Access-Control-Allow-Origin": "*", // CORS Header
      }
    });

  } catch (err: any) {
    console.error("Public API Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}