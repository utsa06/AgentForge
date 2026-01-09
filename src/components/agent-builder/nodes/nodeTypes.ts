// FILE: src/components/agent-builder/nodes/nodeTypes.ts

import { CustomNode } from './CustomNode';

export const nodeTypes = {
  // Generic types
  trigger: CustomNode,
  action: CustomNode,
  condition: CustomNode,
  data: CustomNode,

  // Specific types used in NLAgentCreator
  scheduleTrigger: CustomNode,
  webhookTrigger: CustomNode,
  sendEmail: CustomNode,
  aiProcess: CustomNode,
  apiCall: CustomNode,
  ifElse: CustomNode,
};