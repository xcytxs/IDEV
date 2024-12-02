import { Agent, AgentType } from '../types/agent';

export interface TeamTemplate {
  name: string;
  description: string;
  agents: Agent[];
}

export const teamTemplates: Record<string, TeamTemplate> = {
  webDevelopment: {
    name: 'Web Development Team',
    description: 'Full-stack web development team with expertise in React and TypeScript',
    agents: [
      {
        id: 'architect-web',
        name: 'Web Architect',
        type: 'orchestrator',
        provider: 'system',
        model: 'architect-v1',
        description: 'Manages web architecture and technical decisions',
        goal: 'Design scalable web architectures',
        autonomyLevel: 'full',
        status: 'active',
        capabilities: {
          canCreateAgents: true,
          canModifyProject: true,
          canAssignTasks: true,
          canManageWorkflow: true,
          canAccessFiles: true,
          canExecuteCommands: true
        }
      },
      {
        id: 'frontend-dev',
        name: 'Frontend Developer',
        type: 'developer',
        provider: 'system',
        model: 'frontend-v1',
        description: 'Implements UI components and frontend logic',
        goal: 'Create responsive and accessible user interfaces',
        autonomyLevel: 'limited',
        status: 'active',
        capabilities: {
          canModifyProject: true,
          canAccessFiles: true,
          canExecuteCommands: true
        }
      },
      {
        id: 'backend-dev',
        name: 'Backend Developer',
        type: 'developer',
        provider: 'system',
        model: 'backend-v1',
        description: 'Implements server-side logic and APIs',
        goal: 'Build robust backend services',
        autonomyLevel: 'limited',
        status: 'active',
        capabilities: {
          canModifyProject: true,
          canAccessFiles: true,
          canExecuteCommands: true
        }
      }
    ]
  },
  gameDevelopment: {
    name: 'Game Development Team',
    description: 'Specialized team for creating web-based games',
    agents: [
      {
        id: 'game-architect',
        name: 'Game Architect',
        type: 'orchestrator',
        provider: 'system',
        model: 'game-architect-v1',
        description: 'Manages game architecture and systems',
        goal: 'Design engaging game systems',
        autonomyLevel: 'full',
        status: 'active',
        capabilities: {
          canCreateAgents: true,
          canModifyProject: true,
          canAssignTasks: true,
          canManageWorkflow: true,
          canAccessFiles: true,
          canExecuteCommands: true
        }
      },
      {
        id: 'game-dev',
        name: 'Game Developer',
        type: 'developer',
        provider: 'system',
        model: 'game-dev-v1',
        description: 'Implements game mechanics and features',
        goal: 'Create fun and engaging gameplay',
        autonomyLevel: 'limited',
        status: 'active',
        capabilities: {
          canModifyProject: true,
          canAccessFiles: true,
          canExecuteCommands: true
        }
      },
      {
        id: 'game-designer',
        name: 'Game Designer',
        type: 'creative',
        provider: 'system',
        model: 'designer-v1',
        description: 'Designs game mechanics and user experience',
        goal: 'Create compelling game design',
        autonomyLevel: 'limited',
        status: 'active',
        capabilities: {
          canModifyProject: true,
          canAccessFiles: true
        }
      }
    ]
  }
};