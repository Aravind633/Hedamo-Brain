

"use server";

import { createClient } from "@/lib/supabase/server";

// 1. Define the Interface to fix the "never" type error
interface GraphNote {
  id: string;
  title: string;
  type: string;
  embedding: any; // We handle the parsing of this manually
}

// Helper: Cosine Similarity for Edges
function cosineSimilarity(vecA: any, vecB: any) {
  // Production Fix: Supabase sometimes returns vectors as strings in edge cases
  const a = typeof vecA === 'string' ? JSON.parse(vecA) : vecA;
  const b = typeof vecB === 'string' ? JSON.parse(vecB) : vecB;

  if (!Array.isArray(a) || !Array.isArray(b)) return 0;

  const dotProduct = a.reduce((sum: number, val: number, i: number) => sum + val * (b[i] || 0), 0);
  const magnitudeA = Math.sqrt(a.reduce((sum: number, val: number) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum: number, val: number) => sum + val * val, 0));

  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  return dotProduct / (magnitudeA * magnitudeB);
}

export async function getGraphData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { nodes: [], edges: [] };

  // 2. Fetch Notes with Strict Type Casting
  // We explicitly tell TS that this returns an array of GraphNote objects
  const { data: notes } = await supabase
    .from("notes")
    .select("id, title, type, embedding")
    .eq("user_id", user.id) as { data: GraphNote[] | null }; 

  if (!notes || notes.length === 0) {
    return { nodes: [], edges: [] };
  }

  // 3. Generate Nodes (Now Type-Safe)
  const nodes = notes.map((note) => ({
    id: note.id,
    data: { label: note.title, type: note.type },
    // Random initial layout - the React Flow library will handle the rest or user can drag
    position: { x: Math.random() * 500, y: Math.random() * 500 },
    type: "customNode", // Assuming you are using custom nodes
  }));

  // 4. Generate Edges based on similarity
  const edges: any[] = [];
  
  // Compare every note with every other note (O(n^2) - okay for small datasets)
  for (let i = 0; i < notes.length; i++) {
    for (let j = i + 1; j < notes.length; j++) {
      const source = notes[i];
      const target = notes[j];

      // Skip if embeddings are missing
      if (!source.embedding || !target.embedding) continue;

      const similarity = cosineSimilarity(source.embedding, target.embedding);

      // Threshold: Connect if similarity > 70% (0.7)
      if (similarity > 0.7) {
        edges.push({
          id: `e-${source.id}-${target.id}`,
          source: source.id,
          target: target.id,
          animated: true,
          style: { stroke: "rgba(100, 100, 100, 0.3)" }, // Subtle connection
        });
      }
    }
  }

  return { nodes, edges };
}