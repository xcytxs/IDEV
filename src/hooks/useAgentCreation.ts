import { useState, useCallback } from 'react';
import { Agent, AgentFormData } from '../types/agent';
import { useOrchestrator } from './useOrchestrator';

export function useAgentCreation(projectId?: string) {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addDecision } = useOrchestrator();

  const createAgent = useCallback(async (formData: AgentFormData): Promise<Agent> => {
    if (!projectId) {
      throw new Error('Project ID is required to create an agent');
    }

    setIsCreating(true);
    setError(null);

    try {
      const decision = await addDecision({
        type: 'agent_creation',
        description: `Create new agent: ${formData.name}`,
        reasoning: `Creating ${formData.type} agent with specified capabilities`
      });

      const newAgent: Agent = {
        ...formData,
        id: `agent-${Date.now()}`,
        status: 'inactive'
      };

      return newAgent;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create agent';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsCreating(false);
    }
  }, [projectId, addDecision]);

  return {
    createAgent,
    isCreating,
    error,
    clearError: () => setError(null)
  };
}