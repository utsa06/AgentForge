export type NodeType = 'trigger' | 'action' | 'condition' | 'data';

export interface NodeData {
  label: string;
  type: NodeType;
  config?: {
    [key: string]: any;
  };
  description?: string;
  icon?: string;
}

export interface AgentNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: NodeData;
}

export interface AgentEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
}

export interface ExecutionLog {
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
  data?: any;
}

export interface ExecutionResult {
  nodeId: string;
  nodeType: string;
  nodeLabel: string;
  result: any;
  timestamp: string;
}

export interface Execution {
  _id: string;
  status: 'running' | 'completed' | 'failed';
  startTime: string; // Changed from timestamp to specific startTime
  endTime?: string;
  duration?: number;
  logs: ExecutionLog[];
  results: ExecutionResult[];
  error?: string;
}

export interface Agent {
  _id?: string;
  id: string; // Used for frontend state primarily
  name: string;
  description: string;
  nodes: AgentNode[];
  edges: AgentEdge[];
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'active' | 'paused';
  triggers?: string[];
  actions?: string[];
  schedule?: string;
}