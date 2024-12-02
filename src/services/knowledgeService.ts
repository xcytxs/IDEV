import { db } from '../db/agentKnowledgeDB';
import { Agent } from '../types/agent';
import { Project, ProjectFile } from '../types/project';
import { AgentKnowledge, ProjectContext, CodeAnalysis } from '../types/knowledge';

export class KnowledgeService {
  static async recordInsight(
    agent: Agent,
    project: Project,
    content: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    const knowledge: Omit<AgentKnowledge, 'id'> = {
      agentId: agent.id,
      projectId: project.id,
      type: 'insight',
      content,
      metadata,
      createdAt: new Date().toISOString()
    };

    await db.addKnowledge(knowledge);
  }

  static async recordDecision(
    agent: Agent,
    project: Project,
    content: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    const knowledge: Omit<AgentKnowledge, 'id'> = {
      agentId: agent.id,
      projectId: project.id,
      type: 'decision',
      content,
      metadata,
      createdAt: new Date().toISOString()
    };

    await db.addKnowledge(knowledge);
  }

  static async recordLearning(
    agent: Agent,
    project: Project,
    content: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    const knowledge: Omit<AgentKnowledge, 'id'> = {
      agentId: agent.id,
      projectId: project.id,
      type: 'learning',
      content,
      metadata,
      createdAt: new Date().toISOString()
    };

    await db.addKnowledge(knowledge);
  }

  static async recordError(
    agent: Agent,
    project: Project,
    content: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    const knowledge: Omit<AgentKnowledge, 'id'> = {
      agentId: agent.id,
      projectId: project.id,
      type: 'error',
      content,
      metadata,
      createdAt: new Date().toISOString()
    };

    await db.addKnowledge(knowledge);
  }

  static async addProjectContext(
    project: Project,
    type: ProjectContext['type'],
    content: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    const context: Omit<ProjectContext, 'id'> = {
      projectId: project.id,
      type,
      content,
      metadata,
      createdAt: new Date().toISOString()
    };

    await db.addContext(context);
  }

  static async analyzeCode(
    project: Project,
    file: ProjectFile,
    type: CodeAnalysis['type'],
    content: string,
    suggestions?: string[],
    metadata?: Record<string, any>
  ): Promise<void> {
    const analysis: Omit<CodeAnalysis, 'id'> = {
      projectId: project.id,
      fileId: file.id,
      type,
      content,
      suggestions,
      metadata,
      createdAt: new Date().toISOString()
    };

    await db.addAnalysis(analysis);
  }

  static async getAgentMemory(agent: Agent, project: Project) {
    const [knowledge, contexts, analyses] = await Promise.all([
      db.getKnowledgeForAgent(agent.id),
      db.getProjectContexts(project.id),
      Promise.all(project.files.map(file => 
        db.getFileAnalyses(project.id, file.id)
      )).then(fileAnalyses => fileAnalyses.flat())
    ]);

    return {
      knowledge,
      contexts,
      analyses
    };
  }
}