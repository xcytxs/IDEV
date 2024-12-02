import { Workflow, WorkflowStep } from '../types/workflow';

export interface WorkflowTemplate {
  name: string;
  description: string;
  workflow: Workflow;
}

export const workflowTemplates: Record<string, WorkflowTemplate> = {
  webDevelopment: {
    name: 'Web Development Workflow',
    description: 'Standard workflow for web development projects',
    workflow: {
      id: 'web-dev-workflow',
      name: 'Web Development',
      steps: [
        {
          id: 'requirements',
          name: 'Requirements Analysis',
          agentType: 'orchestrator',
          actions: ['analyze-requirements', 'create-specs'],
          dependencies: []
        },
        {
          id: 'architecture',
          name: 'Architecture Design',
          agentType: 'orchestrator',
          actions: ['design-architecture', 'create-structure'],
          dependencies: ['requirements']
        },
        {
          id: 'frontend-dev',
          name: 'Frontend Development',
          agentType: 'developer',
          actions: ['create-components', 'implement-features'],
          dependencies: ['architecture']
        },
        {
          id: 'backend-dev',
          name: 'Backend Development',
          agentType: 'developer',
          actions: ['create-api', 'implement-logic'],
          dependencies: ['architecture']
        },
        {
          id: 'testing',
          name: 'Testing',
          agentType: 'support',
          actions: ['run-tests', 'fix-issues'],
          dependencies: ['frontend-dev', 'backend-dev']
        }
      ]
    }
  },
  gameDevelopment: {
    name: 'Game Development Workflow',
    description: 'Specialized workflow for game development',
    workflow: {
      id: 'game-dev-workflow',
      name: 'Game Development',
      steps: [
        {
          id: 'game-design',
          name: 'Game Design',
          agentType: 'creative',
          actions: ['design-mechanics', 'create-specs'],
          dependencies: []
        },
        {
          id: 'architecture',
          name: 'Game Architecture',
          agentType: 'orchestrator',
          actions: ['design-systems', 'create-structure'],
          dependencies: ['game-design']
        },
        {
          id: 'core-mechanics',
          name: 'Core Mechanics',
          agentType: 'developer',
          actions: ['implement-mechanics', 'create-systems'],
          dependencies: ['architecture']
        },
        {
          id: 'gameplay',
          name: 'Gameplay Features',
          agentType: 'developer',
          actions: ['implement-features', 'create-interactions'],
          dependencies: ['core-mechanics']
        },
        {
          id: 'testing',
          name: 'Playtesting',
          agentType: 'support',
          actions: ['test-gameplay', 'balance-mechanics'],
          dependencies: ['gameplay']
        }
      ]
    }
  }
};