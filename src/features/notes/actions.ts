"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { generateNoteMetadata, generateEmbedding } from "@/lib/gemini";

export async function createNote(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const content = formData.get("content") as string;
  const title = formData.get("title") as string;
  const type = formData.get("type") as string;
  const source_url = formData.get("source_url") as string;

  if (!content) {
    throw new Error("Content is required");
  }

  try {
    // 1. Generate AI Metadata (Summary, Tags)
    const { summary, tags } = await generateNoteMetadata(content);

    // 2. Generate Vector Embedding (768-dim)
    const embedding = await generateEmbedding(content);

    // 3. Insert into Supabase
    // 🔴 THE FIX: Cast the object to 'any' to bypass the "type never" error
    const { error } = await supabase.from("notes").insert({
      user_id: user.id,
      content: content,
      title: title || "Untitled Note",
      type: type || "idea",
      source_url: source_url || "",
      summary: summary,
      tags: tags,
      embedding: embedding
    } as any);

    if (error) {
      console.error("Supabase Insert Error:", error);
      throw new Error("Failed to save note to memory bank.");
    }

  } catch (error) {
    console.error("Create Note Error:", error);
    // In production, you might want to return this error to the UI 
    // rather than throwing, but for now this keeps the logic simple.
    throw error;
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function deleteNote(noteId: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("notes")
    .delete()
    .eq("id", noteId);

  if (error) {
    console.error("Delete Error:", error);
    throw new Error("Failed to delete note.");
  }

  revalidatePath("/dashboard");
}