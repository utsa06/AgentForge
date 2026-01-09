// FILE: src/components/agent-builder/Canvas.tsx

import React, { useCallback, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  type OnConnect,
  ConnectionLineType,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { nodeTypes } from './nodes/nodeTypes';
import { useCanvasStore } from '../../store/canvasStore';

type NodeType = 'trigger' | 'action' | 'condition' | 'data';

interface NodeData {
  label: string;
  type: NodeType;
  config?: { [key: string]: any };
  description?: string;
  icon?: string;
}

interface AgentNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: NodeData;
}

interface AgentEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
}

let nodeId = 0;
const getId = () => `node_${nodeId++}`;

const defaultEdgeOptions = {
  type: 'smoothstep',
  animated: true,
  style: { stroke: '#94a3b8', strokeWidth: 2 },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: '#94a3b8',
  },
};

export const Canvas: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { nodes, edges, addNode, addEdge: addStoreEdge, setSelectedNode, setNodes, setEdges } = useCanvasStore();

  const [rfNodes, setRfNodes, onNodesChange] = useNodesState(nodes);
  const [rfEdges, setRfEdges, onEdgesChange] = useEdgesState(edges);

  React.useEffect(() => {
    setRfNodes(nodes);
  }, [nodes, setRfNodes]);

  React.useEffect(() => {
    setRfEdges(edges);
  }, [edges, setRfEdges]);

  React.useEffect(() => {
    setNodes(rfNodes as AgentNode[]);
  }, [rfNodes, setNodes]);

  React.useEffect(() => {
    setEdges(rfEdges as AgentEdge[]);
  }, [rfEdges, setEdges]);

  const onConnect: OnConnect = useCallback(
    (params) => {
      const edge: AgentEdge = {
        id: `edge_${Date.now()}`,
        source: params.source!,
        target: params.target!,
        type: 'smoothstep', // Ensure connected edges are also smoothstep
      };
      addStoreEdge(edge);
    },
    [addStoreEdge]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const data = event.dataTransfer.getData('application/reactflow');

      if (!data || !reactFlowBounds) return;

      const nodeTemplate = JSON.parse(data);
      const position = {
        x: event.clientX - reactFlowBounds.left - 100,
        y: event.clientY - reactFlowBounds.top - 50,
      };

      const newNode: AgentNode = {
        id: getId(),
        type: nodeTemplate.type,
        position,
        data: {
          label: nodeTemplate.label,
          type: nodeTemplate.type,
          description: nodeTemplate.description,
          config: {},
        },
      };

      addNode(newNode);
    },
    [addNode]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: any) => {
      setSelectedNode(node as AgentNode);
    },
    [setSelectedNode]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  return (
    <div ref={reactFlowWrapper} className="flex-1 bg-slate-950">
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionLineType={ConnectionLineType.SmoothStep}
        connectionLineStyle={{ stroke: '#cbd5e1', strokeWidth: 2 }}
        fitView
        className="animate-in fade-in duration-700"
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#334155" />
        <Controls className="bg-slate-800/80 backdrop-blur-md border border-slate-700 !shadow-none !rounded-lg" />
        <MiniMap
          className="!bg-slate-800/80 !backdrop-blur-md !border !border-slate-700 !rounded-lg !shadow-none"
          nodeColor={(node) => {
            switch (node.type) {
              case 'trigger': return '#10b981';
              case 'action': return '#3b82f6';
              case 'condition': return '#f59e0b';
              case 'data': return '#a855f7';
              default: return '#64748b';
            }
          }}
          maskColor="rgba(15, 23, 42, 0.6)"
        />
      </ReactFlow>
    </div>
  );
};