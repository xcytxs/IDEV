import Dexie, { Table } from 'dexie';
import { AgentKnowledge, ProjectContext, CodeAnalysis } from '../types/knowledge';

export class AgentKnowledgeDB extends Dexie {
  knowledge!: Table<AgentKnowledge>;
  contexts!: Table<ProjectContext>;
  analyses!: Table<CodeAnalysis>;

  constructor() {
    super('AgentKnowledgeDB');
    
    this.version(1).stores({
      knowledge: '++id, agentId, projectId, type, createdAt',
      contexts: '++id, projectId, type, createdAt',
      analyses: '++id, projectId, fileId, type, createdAt'
    });
  }

  async addKnowledge(knowledge: Omit<AgentKnowledge, 'id'>): Promise<number> {
    return await this.knowledge.add({
      ...knowledge,
      createdAt: new Date().toISOString()
    });
  }

  async getKnowledgeForAgent(agentId: string): Promise<AgentKnowledge[]> {
    return await this.knowledge
      .where('agentId')
      .equals(agentId)
      .reverse()
      .sortBy('createdAt');
  }

  async getKnowledgeForProject(projectId: string): Promise<AgentKnowledge[]> {
    return await this.knowledge
      .where('projectId')
      .equals(projectId)
      .reverse()
      .sortBy('createdAt');
  }

  async addContext(context: Omit<ProjectContext, 'id'>): Promise<number> {
    return await this.contexts.add({
      ...context,
      createdAt: new Date().toISOString()
    });
  }

  async getProjectContexts(projectId: string): Promise<ProjectContext[]> {
    return await this.contexts
      .where('projectId')
      .equals(projectId)
      .reverse()
      .sortBy('createdAt');
  }

  async addAnalysis(analysis: Omit<CodeAnalysis, 'id'>): Promise<number> {
    return await this.analyses.add({
      ...analysis,
      createdAt: new Date().toISOString()
    });
  }

  async getFileAnalyses(projectId: string, fileId: string): Promise<CodeAnalysis[]> {
    return await this.analyses
      .where(['projectId', 'fileId'])
      .equals([projectId, fileId])
      .reverse()
      .sortBy('createdAt');
  }
}

export const db = new AgentKnowledgeDB();