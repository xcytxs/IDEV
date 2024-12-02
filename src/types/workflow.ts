import { AgentType } from './agent';

export interface WorkflowStep {
  id: string;
  name: string;
  agentType: AgentType;
  actions: string[];
  dependencies: string[];
  status?: 'pending' | 'in-progress' | 'completed' | 'failed';
  assignedAgentId?: string;
}

export interface Workflow {
  id: string;
  name: string;
  steps: WorkflowStep[];
  currentStep?: string;
  status?: 'pending' | 'in-progress' | 'completed' | 'failed';
}