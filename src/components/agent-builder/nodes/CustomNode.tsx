// FILE: src/components/agent-builder/nodes/CustomNode.tsx

import React from 'react';
import { Handle, Position } from 'reactflow';
import { Zap, Play, GitBranch, Database, Loader2, CheckCircle } from 'lucide-react';

// Inline type definitions
type NodeType = 'trigger' | 'action' | 'condition' | 'data';

interface NodeData {
  label: string;
  type: NodeType;
  config?: {
    [key: string]: any;
  };
  description?: string;
  icon?: string;
  active?: boolean; // Added for execution visualization
  status?: 'idle' | 'running' | 'completed' | 'error';
}

interface CustomNodeProps {
  data: NodeData;
  id: string;
  selected: boolean;
}

const nodeIcons = {
  trigger: Zap,
  action: Play,
  condition: GitBranch,
  data: Database,
};

const nodeColors = {
  trigger: 'from-emerald-500/80 to-emerald-600/80 border-emerald-400/50',
  action: 'from-blue-500/80 to-indigo-600/80 border-blue-400/50',
  condition: 'from-amber-500/80 to-orange-600/80 border-amber-400/50',
  data: 'from-purple-500/80 to-pink-600/80 border-purple-400/50',
};

export const CustomNode: React.FC<CustomNodeProps> = ({ data, selected }) => {
  const Icon = nodeIcons[data.type];
  const colorClass = nodeColors[data.type];
  const isActive = data.active || data.status === 'running';
  const isCompleted = data.status === 'completed';

  return (
    <div
      className={`
        relative px-4 py-3 min-w-[220px] rounded-xl
        bg-gradient-to-br ${colorClass}
        backdrop-blur-xl border
        transition-all duration-300
        ${selected ? 'ring-2 ring-white shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105 z-10' : 'hover:scale-102 hover:shadow-lg'}
        ${isActive ? 'ring-2 ring-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.4)] scale-105 z-20' : ''}
      `}
    >
      {/* Input Handle */}
      {data.type !== 'trigger' && (
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 !bg-slate-900 border-2 border-white/50 transition-colors hover:bg-white"
        />
      )}

      {/* Node Content */}
      <div className="flex items-center gap-3 text-white">
        <div className={`
          p-2 rounded-lg backdrop-blur-md shadow-inner transition-all duration-500
          ${isActive ? 'bg-white/30 animate-pulse' : 'bg-white/10'}
          ${isCompleted ? 'bg-green-400/20 text-green-200' : ''}
        `}>
          {isActive ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : isCompleted ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <Icon className="w-5 h-5" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm truncate shadow-black drop-shadow-md">{data.label}</div>
          {data.description && (
            <div className="text-xs text-white/90 mt-1 truncate font-medium">{data.description}</div>
          )}
        </div>

        {/* Status Indicator Dot */}
        {isActive && (
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        )}
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-slate-900 border-2 border-white/50 transition-colors hover:bg-white"
      />
    </div>
  );
};