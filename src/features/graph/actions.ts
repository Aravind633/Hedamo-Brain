// "use server";

// import { createClient } from "@/lib/supabase/server";

// // Helper: Calculate Cosine Similarity between two vectors
// function cosineSimilarity(vecA: number[], vecB: number[]) {
//   const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
//   // Assuming embeddings are normalized (Gemini/OpenAI usually are), magnitude is ~1.
//   // If not, you'd divide by (magA * magB). For simplicity/speed with Gemini, dotProduct is usually sufficient.
//   return dotProduct;
// }

// export async function getGraphData() {
//   const supabase = await createClient();
//   const { data: { user } } = await supabase.auth.getUser();
  
//   if (!user) return { nodes: [], edges: [] };

//   // 1. Fetch all notes with embeddings
//   const { data: notes, error } = await supabase
//     .from("notes")
//     .select("id, title, type, embedding")
//     .eq("user_id", user.id)
//     .not("embedding", "is", null); // Only notes with AI data

//   if (error || !notes) return { nodes: [], edges: [] };

//   const nodes = [];
//   const edges = [];
//   const threshold = 0.65; // Similarity threshold (0 to 1). Adjust to make links stricter/looser.

//   // 2. Build Nodes for React Flow
//   nodes.push(
//     ...notes.map((note) => ({
//       id: note.id,
//       data: { label: note.title, type: note.type },
//       // Random initial position (scattered)
//       position: { x: Math.random() * 500, y: Math.random() * 500 },
//       type: "default", // or custom if we want fancy cards
//       className: "dark:bg-neutral-900 dark:text-white border-neutral-200 dark:border-neutral-800 rounded-xl shadow-lg w-40 text-center text-xs font-semibold p-2",
//     }))
//   );

//   // 3. Build Edges (Compare every note to every other note)
//   // This is O(N^2), which is fine for < 500 notes. For thousands, you'd use a different approach.
//   for (let i = 0; i < notes.length; i++) {
//     for (let j = i + 1; j < notes.length; j++) {
//       const noteA = notes[i];
//       const noteB = notes[j];

//       // Parse vector string if needed, depending on how Supabase returns it. 
//       // pgvector usually returns a string "[0.1, 0.2...]" or an array. 
//       // Supabase JS client usually converts it to number[] automatically.
      
//       const similarity = cosineSimilarity(noteA.embedding as any, noteB.embedding as any);

//       if (similarity > threshold) {
//         edges.push({
//           id: `e-${noteA.id}-${noteB.id}`,
//           source: noteA.id,
//           target: noteB.id,
//           animated: true,
//           style: { stroke: "#525252" }, // Neutral gray edge
//         });
//       }
//     }
//   }

//   return { nodes, edges };
// }


"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * 🧠 Helper: Safely parse vector and calculate Cosine Similarity
 * Supabase/pgvector often returns embeddings as strings "[0.1, 0.2...]" 
 * rather than native JS arrays. This helper ensures they are parsed before reduction.
 */
function cosineSimilarity(vecA: any, vecB: any) {
  // 1. Convert string representation to actual numeric arrays if necessary
  const a = typeof vecA === 'string' ? JSON.parse(vecA) : vecA;
  const b = typeof vecB === 'string' ? JSON.parse(vecB) : vecB;

  // 2. Safety check to prevent .reduce errors if data is missing
  if (!Array.isArray(a) || !Array.isArray(b)) return 0;

  // 3. Calculate Dot Product
  // Gemini embeddings are typically normalized, so dot product equals cosine similarity.
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
  
  /**
   * 📈 Similarity Threshold
   * 0.65 is usually a "sweet spot" for Gemini 768-dim embeddings.
   * Increase this (e.g., 0.8) for fewer, stronger links.
   * Decrease this (e.g., 0.5) for a more dense, messy brain map.
   */
  const threshold = 0.65; 

  // 2. Build Nodes for React Flow
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

  // 3. Build Edges (Compare every note to every other note)
  // O(N^2) complexity: perfectly fine for the small-to-medium datasets expected in a take-home.
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