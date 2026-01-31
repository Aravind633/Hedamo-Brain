import { createClient } from "@/lib/supabase/server";
import { generateNoteMetadata } from "@/features/brain/services/gemini";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // 1. Security: Ensure user is logged in
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 2. Get content from the request body
    const body = await req.json();
    const { content } = body;

    if (!content) {
      return new NextResponse("Content is required", { status: 400 });
    }

    // 3. Call the Gemini Service (The same one we used in actions.ts)
    const metadata = await generateNoteMetadata(content);

    // 4. Return the AI results as JSON
    return NextResponse.json(metadata);

  } catch (error) {
    console.error("[AI_ROUTE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}