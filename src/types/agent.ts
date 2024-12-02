export type AgentType = 'orchestrator' | 'researcher' | 'writer' | 'developer' | 'support' | 'creative';
export type AgentStatus = 'active' | 'inactive';
export type PersonalityType = 'professional' | 'friendly' | 'technical' | 'creative';
export type KnowledgeLevel = 'expert' | 'intermediate' | 'beginner';
export type ResponseLength = 'concise' | 'detailed' | 'brief';
export type AutonomyLevel = 'full' | 'limited' | 'supervised';

export interface AgentCapabilities {
  canCreateAgents?: boolean;
  canModifyProject?: boolean;
  canAssignTasks?: boolean;
  canManageWorkflow?: boolean;
  canAccessFiles?: boolean;
  canExecuteCommands?: boolean;
}

export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  provider: string;
  model: string;
  description?: string;
  goal?: string;
  systemPrompt?: string;
  personality?: PersonalityType;
  tone?: string;
  knowledgeLevel?: KnowledgeLevel;
  specialization?: string;
  responseLength?: ResponseLength;
  autonomyLevel: AutonomyLevel;
  status: AgentStatus;
  capabilities?: AgentCapabilities;
  workflowIds?: string[];
}

export interface AgentFormData extends Omit<Agent, 'id' | 'status'> {
  name: string;
  provider: string;
  model: string;
  autonomyLevel: AutonomyLevel;
  description?: string;
  goal?: string;
  systemPrompt?: string;
  type?: AgentType;
  personality?: PersonalityType;
  tone?: string;
  knowledgeLevel?: KnowledgeLevel;
  specialization?: string;
  responseLength?: ResponseLength;
  capabilities?: AgentCapabilities;
  workflowIds?: string[];
}