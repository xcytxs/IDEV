import { Agent } from './agent';
import { Project } from './project';

export interface ProjectContext {
  id: string;
  projectId: string;
  chatHistory: ChatMessage[];
  decisions: Decision[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  attachments?: string[];
}

export interface Decision {
  id: string;
  type: 'agent_creation' | 'project_update' | 'task_creation' | 'workflow_creation';
  description: string;
  reasoning: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected' | 'implemented';
}

export interface OrchestratorAgent extends Agent {
  type: 'orchestrator';
  capabilities: {
    canCreateAgents: boolean;
    canModifyProject: boolean;
    canAssignTasks: boolean;
    canManageWorkflow: boolean;
  };
  context: {
    activeProjects: string[];
    projectContexts: { [projectId: string]: ProjectContext };
  };
}