export interface AgentKnowledge {
  id?: number;
  agentId: string;
  projectId: string;
  type: 'insight' | 'decision' | 'learning' | 'error';
  content: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface ProjectContext {
  id?: number;
  projectId: string;
  type: 'requirement' | 'architecture' | 'implementation' | 'bug' | 'feature';
  content: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface CodeAnalysis {
  id?: number;
  projectId: string;
  fileId: string;
  type: 'syntax' | 'logic' | 'performance' | 'security' | 'quality';
  content: string;
  suggestions?: string[];
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface AgentMemory {
  knowledge: AgentKnowledge[];
  contexts: ProjectContext[];
  analyses: CodeAnalysis[];
}