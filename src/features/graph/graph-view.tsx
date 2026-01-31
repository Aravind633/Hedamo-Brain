"use client";

import { useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node
} from "reactflow";
import "reactflow/dist/style.css";

// Props passed from the server page
type GraphViewProps = {
  initialNodes: Node[];
  initialEdges: Edge[];
};

export function GraphView({ initialNodes, initialEdges }: GraphViewProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="h-[75vh] w-full rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950 overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        attributionPosition="bottom-right"
      >
        <Background gap={16} size={1} className="bg-neutral-50/50 dark:bg-neutral-900/20" />
        <Controls className="fill-neutral-500 text-neutral-500" />
        <MiniMap 
            nodeColor="#3b82f6" 
            className="dark:bg-neutral-900 border dark:border-neutral-800 rounded-lg"
            maskColor="rgba(0,0,0, 0.1)"
        />
      </ReactFlow>
    </div>
  );
}