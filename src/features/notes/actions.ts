"use server"

import { createClient } from "@/lib/supabase/server";
// ✅ Make sure it points to the 'lib' version
import { generateNoteMetadata, generateEmbedding } from "@/lib/gemini";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createNote(formData: FormData) {
  const content = formData.get("content") as string;
  const title = formData.get("title") as string;
  const type = formData.get("type") as string;
  const sourceUrl = formData.get("source_url") as string;

  if (!content || !title) return;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  // --- AI PROCESSING START ---
  // 1. Generate Metadata
  const metadata = await generateNoteMetadata(content);
  
  // 2. Generate Vector Embedding
  const embedding = await generateEmbedding(content);
  // --- AI PROCESSING END ---

  const { error } = await supabase.from("notes").insert({
    user_id: user.id,
    content: content,
    title: title,
    type: type || 'note',
    source_url: sourceUrl,
    summary: metadata.summary, // Saved
    tags: metadata.tags,       // Saved
    embedding: embedding       // Saved (Vector)
  });

  if (error) {
    console.error("DB Error:", error);
    throw new Error("Failed to save note");
  }

  revalidatePath("/");
  redirect("/");
}

export async function deleteNote(noteId: string) {
    const supabase = await createClient();
    await supabase.from("notes").delete().eq("id", noteId);
    revalidatePath("/");
}

