import { OrchestratorAgent, ProjectTemplate, Decision } from '../types/orchestrator';
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

  async initializeProject(project: ProjectTemplate): Promise<void> {
    try {
      // Initialize project workspace
      await this.createProjectStructure(project);
      
      // Initialize required agents
      await this.initializeAgents(project.agents.required);
      
      // Set up initial workflows
      await this.initializeWorkflows(project.workflowTemplates);
      
      // Create initial files
      await this.initializeFiles(project.files);
      
      // Configure project settings
      await this.configureProjectSettings(project.settings);
      
    } catch (error) {
      console.error('Failed to initialize project:', error);
      throw new Error('Project initialization failed');
    }
  }

  private async createProjectStructure(project: ProjectTemplate): Promise<void> {
    const directories = [
      'src',
      'tests',
      'docs',
      'research',
      'assets',
      'workflows'
    ];

    for (const dir of directories) {
      await WebContainerManager.createDirectory(`/workspace/${project.name}/${dir}`);
    }
  }

  private async initializeAgents(agents: Agent[]): Promise<void> {
    for (const agent of agents) {
      await this.initializeAgent(agent);
    }
  }

  private async initializeAgent(agent: Agent): Promise<void> {
    // Create agent workspace
    await WebContainerManager.createDirectory(`/workspace/agents/${agent.id}`);
    
    // Initialize agent configuration
    await WebContainerManager.writeFile(
      `/workspace/agents/${agent.id}/config.json`,
      JSON.stringify({
        role: agent.role,
        permissions: agent.permissions,
        capabilities: agent.capabilities
      }, null, 2)
    );
  }

  private async initializeWorkflows(workflows: any[]): Promise<void> {
    for (const workflow of workflows) {
      await this.initializeWorkflow(workflow);
    }
  }

  private async initializeWorkflow(workflow: any): Promise<void> {
    // Create workflow configuration
    await WebContainerManager.writeFile(
      `/workspace/workflows/${workflow.id}.json`,
      JSON.stringify(workflow, null, 2)
    );
  }

  private async initializeFiles(files: ProjectTemplate['files']): Promise<void> {
    for (const file of files) {
      await WebContainerManager.writeFile(
        `/workspace/${file.path}`,
        file.content
      );
    }
  }

  private async configureProjectSettings(settings: ProjectTemplate['settings']): Promise<void> {
    // Create environment variables file
    await WebContainerManager.writeFile(
      '/workspace/.env',
      Object.entries(settings.environmentVariables)
        .map(([key, value]) => `${key}=${value}`)
        .join('\n')
    );

    // Create project configuration
    await WebContainerManager.writeFile(
      '/workspace/project.json',
      JSON.stringify({
        buildCommand: settings.buildCommand,
        startCommand: settings.startCommand,
        testCommand: settings.testCommand,
        customSettings: settings.customSettings
      }, null, 2)
    );
  }

  async suggestAgents(project: ProjectTemplate): Promise<Agent[]> {
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

  private async initializeProjectKnowledge(project: ProjectTemplate): Promise<void> {
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

  private async analyzeProjectStructure(project: ProjectTemplate) {
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