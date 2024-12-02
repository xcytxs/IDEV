import { useState, useEffect } from 'react';
import { Agent } from '../types/agent';
import { Project } from '../types/project';
import { TeamService } from '../services/teamService';
import { useAgentMemory } from './useAgentMemory';

export function useTeam(project: Project | null) {
  const [team, setTeam] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get team memory
  const { memory } = useAgentMemory(
    team.find(a => a.type === 'orchestrator') || null,
    project
  );

  useEffect(() => {
    const initializeTeam = async () => {
      if (!project) return;

      setIsLoading(true);
      setError(null);

      try {
        // Create development team
        const newTeam = await TeamService.createDevTeam(project);
        
        // Assign initial tasks
        await TeamService.assignTasks(project, newTeam);
        
        // Initialize team knowledge
        await TeamService.initializeTeamKnowledge(project, newTeam);
        
        setTeam(newTeam);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize team');
      } finally {
        setIsLoading(false);
      }
    };

    initializeTeam();
  }, [project?.id]);

  return { team, isLoading, error, memory };
}