import axios from 'axios';

// Configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

// Types
export interface Agent {
  id?: string;
  _id?: string;
  name: string;
  description: string;
  nodes: any[];
  edges: any[];
  status: 'draft' | 'active' | 'inactive';
  triggers: string[];
  actions: string[];
  schedule: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ExecutionResult {
  _id: string;
  startTime: string;
  status: 'completed' | 'failed' | 'running';
  duration: number;
  logs: any[];
  results: any[];
}

// --- Mock Implementation ---
const SIMULATE_DELAY = 800;
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getStoredAgents = (): any[] => {
  const stored = localStorage.getItem('mock_agents');
  return stored ? JSON.parse(stored) : [];
};

const saveStoredAgents = (agents: any[]) => {
  localStorage.setItem('mock_agents', JSON.stringify(agents));
};

const MockAgentService = {
  create: async (agentData: any) => {
    await delay(SIMULATE_DELAY);
    const agents = getStoredAgents();
    const newAgent = { ...agentData, _id: `agent_${Date.now()}`, createdAt: new Date().toISOString() };
    agents.push(newAgent);
    saveStoredAgents(agents);
    return newAgent;
  },

  getAll: async () => {
    await delay(SIMULATE_DELAY);
    return getStoredAgents();
  },

  getById: async (id: string) => {
    await delay(SIMULATE_DELAY);
    const agents = getStoredAgents();
    const agent = agents.find((a: any) => a._id === id || a.id === id);
    if (!agent) throw new Error('Agent not found');
    return agent;
  },

  update: async (id: string, agentData: any) => {
    await delay(SIMULATE_DELAY);
    const agents = getStoredAgents();
    const index = agents.findIndex((a: any) => a._id === id || a.id === id);
    if (index === -1) throw new Error('Agent not found');

    const updatedAgent = { ...agents[index], ...agentData, updatedAt: new Date().toISOString() };
    agents[index] = updatedAgent;
    saveStoredAgents(agents);
    return updatedAgent;
  },

  delete: async (id: string) => {
    await delay(SIMULATE_DELAY);
    const agents = getStoredAgents();
    const filtered = agents.filter((a: any) => a._id !== id && a.id !== id);
    saveStoredAgents(filtered);
    return { success: true };
  },

  execute: async (_id: string) => {
    await delay(2000);
    return {
      status: 'completed',
      output: 'Agent executed successfully. Checked 5 sources. No anomalies found.'
    };
  },

  getExecutions: async (_id: string) => {
    await delay(SIMULATE_DELAY);
    return [
      {
        _id: 'exec_1',
        startTime: new Date().toISOString(),
        status: 'completed',
        duration: 1200,
        logs: [
          { timestamp: new Date().toISOString(), level: 'info', message: 'Execution started' },
          { timestamp: new Date().toISOString(), level: 'info', message: 'Checking sources...' },
          { timestamp: new Date().toISOString(), level: 'success', message: 'Completed successfully' }
        ],
        results: [
          { nodeId: 'node_1', nodeType: 'trigger', nodeLabel: 'Schedule', result: { triggered: true }, timestamp: new Date().toISOString() }
        ]
      },

    ];
  },

  executeAdHoc: async (prompt: string) => {
    await delay(2000);
    return {
      status: 'success',
      data: {
        output: `<h1>Mock Website</h1><p>This is a mock response for prompt: ${prompt.substring(0, 30)}...</p>
            <style>body { font-family: sans-serif; padding: 20px; }</style>`
      }
    };
  }
};

// --- Real Implementation ---
const RealAgentService = {
  create: async (agentData: any) => {
    const response = await axios.post(`${API_URL}/agents`, agentData);
    return response.data;
  },

  getAll: async () => {
    const response = await axios.get(`${API_URL}/agents`);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await axios.get(`${API_URL}/agents/${id}`);
    return response.data;
  },

  update: async (id: string, agentData: any) => {
    const response = await axios.put(`${API_URL}/agents/${id}`, agentData);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await axios.delete(`${API_URL}/agents/${id}`);
    return response.data;
  },

  execute: async (id: string) => {
    const response = await axios.post(`${API_URL}/agents/${id}/execute`);
    return response.data;
  },

  getExecutions: async (id: string) => {
    const response = await axios.get(`${API_URL}/agents/${id}/executions`);
    return response.data;
  },

  executeAdHoc: async (prompt: string) => {
    const response = await axios.post(`${API_URL}/agents/execute-adhoc`, { prompt });
    return response.data;
  }
};

// Export based on configuration
export const agentService = USE_MOCK ? MockAgentService : RealAgentService;

console.log(`Agent Service Initialized. Mode: ${USE_MOCK ? 'MOCK' : 'REAL'}`);
