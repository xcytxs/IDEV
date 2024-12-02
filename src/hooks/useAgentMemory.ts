import { useState, useEffect } from 'react';
import { Agent } from '../types/agent';
import { Project } from '../types/project';
import { AgentMemory } from '../types/knowledge';
import { KnowledgeService } from '../services/knowledgeService';

export function useAgentMemory(agent: Agent | null, project: Project | null) {
  const [memory, setMemory] = useState<AgentMemory | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMemory = async () => {
      if (!agent || !project) return;

      setIsLoading(true);
      setError(null);

      try {
        const agentMemory = await KnowledgeService.getAgentMemory(agent, project);
        setMemory(agentMemory);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load agent memory');
        setMemory(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadMemory();
  }, [agent?.id, project?.id]);

  return { memory, isLoading, error };
}