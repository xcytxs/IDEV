import { useState, useEffect } from 'react';
import { Workflow } from '../types/workflow';
import { Project } from '../types/project';
import { Agent } from '../types/agent';
import { WorkflowService } from '../services/workflowService';
import { useTeam } from './useTeam';

export function useWorkflow(project: Project | null, templateId: string) {
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { team } = useTeam(project);

  useEffect(() => {
    const initializeWorkflow = async () => {
      if (!project || !team.length) return;

      setIsLoading(true);
      setError(null);

      try {
        const newWorkflow = await WorkflowService.createWorkflow(
          project,
          templateId,
          team
        );
        setWorkflow(newWorkflow);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize workflow');
      } finally {
        setIsLoading(false);
      }
    };

    initializeWorkflow();
  }, [project?.id, team.length, templateId]);

  const executeStep = async (stepId: string) => {
    if (!workflow || !project) return;

    const step = workflow.steps.find(s => s.id === stepId);
    if (!step) return;

    const agent = team.find(a => a.id === step.assignedAgentId);
    if (!agent) return;

    setIsLoading(true);
    setError(null);

    try {
      await WorkflowService.executeStep(project, workflow, step, agent);
      setWorkflow(prev => prev ? {
        ...prev,
        steps: prev.steps.map(s => 
          s.id === stepId ? { ...s, status: 'completed' } : s
        )
      } : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to execute step');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    workflow,
    isLoading,
    error,
    executeStep
  };
}