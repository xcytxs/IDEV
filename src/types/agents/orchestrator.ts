import { BaseAgent } from '../agent';

export interface OrchestratorCapabilities {
  canAssignTasks: boolean;
  canManageWorkflow: boolean;
  canAccessAllAgents: boolean;
  canModifyPermissions: boolean;
  canViewMetrics: boolean;
}

export interface OrchestratorAgent extends BaseAgent {
  type: 'orchestrator';
  capabilities: OrchestratorCapabilities;
  assignedTeams: string[];
  workflowIds: string[];
  metrics: {
    taskCompletion: number;
    teamPerformance: number;
    projectProgress: number;
  };
}