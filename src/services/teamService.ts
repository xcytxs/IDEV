import { Agent } from '../types/agent';
import { Project } from '../types/project';
import { KnowledgeService } from './knowledgeService';
import { db } from '../db/agentKnowledgeDB';

export class TeamService {
  static async createDevTeam(project: Project): Promise<Agent[]> {
    const team: Agent[] = [
      // Lead Architect
      {
        id: 'architect-1',
        name: 'Lead Architect',
        type: 'orchestrator',
        provider: 'system',
        model: 'architect-v1',
        description: 'Manages system architecture and technical decisions',
        goal: 'Design and maintain robust system architecture',
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
      // Senior Developer
      {
        id: 'senior-dev-1',
        name: 'Senior Developer',
        type: 'developer',
        provider: 'system',
        model: 'dev-v1',
        description: 'Implements core functionality and reviews code',
        goal: 'Develop high-quality code and mentor team members',
        autonomyLevel: 'limited',
        status: 'active',
        capabilities: {
          canModifyProject: true,
          canAccessFiles: true,
          canExecuteCommands: true,
          canAssignTasks: true
        }
      },
      // QA Engineer
      {
        id: 'qa-1',
        name: 'QA Engineer',
        type: 'support',
        provider: 'system',
        model: 'qa-v1',
        description: 'Tests functionality and ensures quality',
        goal: 'Maintain high code quality and prevent bugs',
        autonomyLevel: 'limited',
        status: 'active',
        capabilities: {
          canAccessFiles: true,
          canExecuteCommands: true
        }
      }
    ];

    // Record team creation in knowledge base
    for (const agent of team) {
      await KnowledgeService.recordInsight(
        agent,
        project,
        `Agent ${agent.name} joined the team`,
        { role: agent.type }
      );
    }

    return team;
  }

  static async assignTasks(project: Project, team: Agent[]): Promise<void> {
    const architect = team.find(a => a.type === 'orchestrator');
    if (!architect) return;

    // Record task assignments
    await KnowledgeService.recordDecision(
      architect,
      project,
      'Initial task assignments created',
      {
        tasks: [
          { type: 'architecture', assignee: 'architect-1' },
          { type: 'implementation', assignee: 'senior-dev-1' },
          { type: 'testing', assignee: 'qa-1' }
        ]
      }
    );
  }

  static async initializeTeamKnowledge(project: Project, team: Agent[]): Promise<void> {
    // Add project context
    await db.addContext({
      projectId: project.id,
      type: 'architecture',
      content: JSON.stringify({
        team: team.map(a => ({ id: a.id, role: a.type })),
        structure: 'microservices',
        mainTechnologies: ['React', 'TypeScript', 'Node.js']
      }),
      createdAt: new Date().toISOString()
    });

    // Initialize agent-specific knowledge
    for (const agent of team) {
      await KnowledgeService.recordLearning(
        agent,
        project,
        'Initial project setup completed',
        {
          projectType: project.type,
          framework: project.framework,
          role: agent.type
        }
      );
    }
  }
}