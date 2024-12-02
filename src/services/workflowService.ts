import { Workflow, WorkflowStep } from '../types/workflow';
import { Agent } from '../types/agent';
import { Project } from '../types/project';
import { KnowledgeService } from './knowledgeService';
import { workflowTemplates } from '../templates/workflowTemplates';

export class WorkflowService {
  static async createWorkflow(
    project: Project,
    templateId: string,
    team: Agent[]
  ): Promise<Workflow> {
    const template = workflowTemplates[templateId];
    if (!template) {
      throw new Error(`Workflow template ${templateId} not found`);
    }

    const workflow = { ...template.workflow };
    
    // Assign agents to steps based on their type
    workflow.steps = workflow.steps.map(step => ({
      ...step,
      assignedAgentId: team.find(agent => agent.type === step.agentType)?.id
    }));

    // Record workflow creation
    const orchestrator = team.find(a => a.type === 'orchestrator');
    if (orchestrator) {
      await KnowledgeService.recordDecision(
        orchestrator,
        project,
        `Created workflow: ${workflow.name}`,
        { workflowId: workflow.id, steps: workflow.steps }
      );
    }

    return workflow;
  }

  static async executeStep(
    project: Project,
    workflow: Workflow,
    step: WorkflowStep,
    agent: Agent
  ): Promise<void> {
    try {
      // Check dependencies
      const dependencies = workflow.steps.filter(s => 
        step.dependencies.includes(s.id)
      );
      
      if (dependencies.some(d => d.status !== 'completed')) {
        throw new Error('Not all dependencies are completed');
      }

      // Execute step actions
      for (const action of step.actions) {
        await KnowledgeService.recordDecision(
          agent,
          project,
          `Executing action: ${action}`,
          { stepId: step.id, action }
        );
        
        // Execute action based on type
        switch (action) {
          case 'analyze-requirements':
            await this.analyzeRequirements(project, agent);
            break;
          case 'create-specs':
            await this.createSpecifications(project, agent);
            break;
          case 'implement-features':
            await this.implementFeatures(project, agent);
            break;
          // Add more action handlers
        }
      }

      // Update step status
      step.status = 'completed';

      // Record completion
      await KnowledgeService.recordDecision(
        agent,
        project,
        `Completed step: ${step.name}`,
        { stepId: step.id, status: 'completed' }
      );
    } catch (error) {
      step.status = 'failed';
      throw error;
    }
  }

  private static async analyzeRequirements(project: Project, agent: Agent) {
    await KnowledgeService.addProjectContext(
      project,
      'requirement',
      JSON.stringify({
        type: project.type,
        framework: project.framework,
        features: ['core-functionality', 'user-interface']
      })
    );
  }

  private static async createSpecifications(project: Project, agent: Agent) {
    await KnowledgeService.addProjectContext(
      project,
      'architecture',
      JSON.stringify({
        components: ['frontend', 'backend'],
        technologies: [project.framework, project.language]
      })
    );
  }

  private static async implementFeatures(project: Project, agent: Agent) {
    // Implementation logic here
    await KnowledgeService.recordLearning(
      agent,
      project,
      'Implementing project features',
      { status: 'in-progress' }
    );
  }
}