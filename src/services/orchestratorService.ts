import { OrchestratorAgent, ProjectContext, Decision } from '../types/orchestrator';
import { Project } from '../types/project';
import { Agent } from '../types/agent';
import { KnowledgeService } from './knowledgeService';
import { WebContainerManager } from '../utils/webContainer';
import { db } from '../db/agentKnowledgeDB';
import { teamTemplates } from '../templates/teamTemplates';

class OrchestratorService {
  private static STORAGE_KEY = 'orchestrator';
  private static instance: OrchestratorService;
  private orchestrator: OrchestratorAgent;
  private knowledgeService: KnowledgeService;

  private constructor() {
    this.orchestrator = this.loadOrCreateOrchestrator();
    this.knowledgeService = new KnowledgeService();
  }

  private loadOrCreateOrchestrator(): OrchestratorAgent {
    const stored = localStorage.getItem(OrchestratorService.STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      return {
        ...data,
        context: {
          activeProjects: data.context?.activeProjects || [],
          projectContexts: data.context?.projectContexts || {}
        }
      };
    }

    return {
      id: 'orchestrator-1',
      name: 'Project Orchestrator',
      type: 'orchestrator',
      provider: 'system',
      model: 'orchestrator-v1',
      description: 'Main project orchestrator that manages project lifecycle and agent coordination',
      goal: 'Efficiently manage projects and coordinate AI agents',
      systemPrompt: 'You are the project orchestrator responsible for managing project lifecycle and agent coordination.',
      autonomyLevel: 'full',
      status: 'active',
      capabilities: {
        canCreateAgents: true,
        canModifyProject: true,
        canAssignTasks: true,
        canManageWorkflow: true,
        canAccessFiles: true,
        canExecuteCommands: true
      },
      context: {
        activeProjects: [],
        projectContexts: {}
      }
    };
  }

  static getInstance(): OrchestratorService {
    if (!this.instance) {
      this.instance = new OrchestratorService();
    }
    return this.instance;
  }

  async initializeProject(project: Project): Promise<ProjectContext> {
    try {
      // Create workspace directory
      const workspacePath = `/workspace/${project.id}`;
      await WebContainerManager.createWorkspace(workspacePath);

      // Initialize project context
      const context: ProjectContext = {
        id: `ctx-${Date.now()}`,
        projectId: project.id,
        chatHistory: [],
        decisions: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Initialize project files
      for (const file of project.files) {
        await WebContainerManager.writeFile(`${workspacePath}/${file.path}`, file.content);
      }

      // Store project context
      if (!this.orchestrator.context.activeProjects.includes(project.id)) {
        this.orchestrator.context.activeProjects.push(project.id);
      }
      
      this.orchestrator.context.projectContexts[project.id] = context;
      await this.save();

      // Initialize knowledge base
      await this.initializeProjectKnowledge(project);

      return context;
    } catch (error) {
      console.error('Failed to initialize project:', error);
      throw error;
    }
  }

  async suggestAgents(project: Project): Promise<Agent[]> {
    // Get appropriate team template based on project type
    const templateId = project.type === 'game' ? 'gameDevelopment' : 'webDevelopment';
    const template = teamTemplates[templateId];

    if (!template) {
      return [];
    }

    // Return suggested agents from template
    return template.agents.map(agent => ({
      ...agent,
      id: `${agent.id}-${Date.now()}` // Ensure unique IDs
    }));
  }

  private async initializeProjectKnowledge(project: Project): Promise<void> {
    await db.addContext({
      projectId: project.id,
      type: 'architecture',
      content: JSON.stringify({
        type: project.type,
        framework: project.framework,
        language: project.language,
        structure: await this.analyzeProjectStructure(project)
      }),
      createdAt: new Date().toISOString()
    });
  }

  private async analyzeProjectStructure(project: Project) {
    const structure: Record<string, string[]> = {};
    
    for (const file of project.files) {
      const dir = file.path.split('/').slice(0, -1).join('/') || '/';
      if (!structure[dir]) {
        structure[dir] = [];
      }
      structure[dir].push(file.path.split('/').pop() || '');
    }

    return structure;
  }

  private async save(): Promise<void> {
    localStorage.setItem(OrchestratorService.STORAGE_KEY, JSON.stringify(this.orchestrator));
  }

  async addDecision(projectId: string, decision: Omit<Decision, 'id' | 'timestamp' | 'status'>): Promise<Decision> {
    const context = this.orchestrator.context.projectContexts[projectId];
    if (!context) {
      throw new Error('Project context not found');
    }

    const newDecision: Decision = {
      ...decision,
      id: `decision-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      status: 'approved'
    };

    context.decisions.push(newDecision);
    context.updatedAt = new Date().toISOString();
    await this.save();

    return newDecision;
  }
}

export const orchestratorService = OrchestratorService.getInstance();