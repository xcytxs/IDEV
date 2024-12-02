import { useState, useEffect, useCallback, useRef } from 'react';
import { orchestratorService } from '../services/orchestratorService';
import { Project } from '../types/project';
import { ProjectContext, Decision } from '../types/orchestrator';
import { Agent } from '../types/agent';

export function useOrchestrator(project?: Project) {
  const [context, setContext] = useState<ProjectContext | null>(null);
  const [suggestedAgents, setSuggestedAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const initialized = useRef(false);

  const loadProjectContext = useCallback(async () => {
    if (!project) return;

    try {
      setIsLoading(true);
      setError(null);
      
      let projectContext: ProjectContext;
      try {
        projectContext = await orchestratorService.getProjectContext(project.id);
      } catch {
        projectContext = await orchestratorService.initializeProject(project);
      }

      setContext(projectContext);
      
      const agents = await orchestratorService.suggestAgents(project);
      setSuggestedAgents(agents);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load project context');
    } finally {
      setIsLoading(false);
    }
  }, [project?.id]);

  useEffect(() => {
    if (!project || initialized.current) return;
    
    loadProjectContext();
    initialized.current = true;
  }, [project?.id, loadProjectContext]);

  const addDecision = useCallback(async (decision: Omit<Decision, 'id' | 'timestamp' | 'status'>) => {
    if (!project?.id) {
      throw new Error('Project ID is required');
    }

    try {
      const newDecision = await orchestratorService.addDecision(project.id, decision);
      setContext(prev => prev ? {
        ...prev,
        decisions: [...prev.decisions, newDecision]
      } : null);
      return newDecision;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add decision');
      throw err;
    }
  }, [project?.id]);

  return {
    context,
    suggestedAgents,
    isLoading,
    error,
    addDecision,
    refresh: loadProjectContext
  };
}