
"use server";

import { createClient } from "@/lib/supabase/server";


function cosineSimilarity(vecA: any, vecB: any) {

  const a = typeof vecA === 'string' ? JSON.parse(vecA) : vecA;
  const b = typeof vecB === 'string' ? JSON.parse(vecB) : vecB;

  if (!Array.isArray(a) || !Array.isArray(b)) return 0;


  const dotProduct = a.reduce((sum, val, i) => sum + val * (b[i] || 0), 0);
  
  return dotProduct;
}

export async function getGraphData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { nodes: [], edges: [] };

  // 1. Fetch all notes with embeddings
  const { data: notes, error } = await supabase
    .from("notes")
    .select("id, title, type, embedding")
    .eq("user_id", user.id)
    .not("embedding", "is", null); // Only process notes that have AI data

  if (error || !notes) {
    console.error("Graph Data Fetch Error:", error);
    return { nodes: [], edges: [] };
  }

  const nodes = [];
  const edges = [];
  

  const threshold = 0.65; 

  // Build Nodes for React Flow
  nodes.push(
    ...notes.map((note) => ({
      id: note.id,
      data: { label: note.title, type: note.type },
      // Random initial position (scattered) for the flow layout
      position: { x: Math.random() * 800, y: Math.random() * 600 },
      type: "default",
      className: "dark:bg-neutral-900 dark:text-white border-neutral-200 dark:border-neutral-800 rounded-xl shadow-lg w-40 text-center text-xs font-semibold p-2 transition-all hover:scale-105",
    }))
  );


  for (let i = 0; i < notes.length; i++) {
    for (let j = i + 1; j < notes.length; j++) {
      const noteA = notes[i];
      const noteB = notes[j];

      // Use the safe similarity helper
      const similarity = cosineSimilarity(noteA.embedding, noteB.embedding);

      if (similarity > threshold) {
        edges.push({
          id: `e-${noteA.id}-${noteB.id}`,
          source: noteA.id,
          target: noteB.id,
          animated: true, // Adds "Motion & Delight" as per Altibbe requirements
          style: { 
            stroke: similarity > 0.8 ? "#3b82f6" : "#525252", // Blue for very strong links, Gray for others
            strokeWidth: (similarity - threshold) * 5, // Visual hierarchy: stronger link = thicker line
          },
        });
      }
    }
  }

  return { nodes, edges };
}