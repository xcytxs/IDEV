import { useEffect, useRef } from 'react';
import { Project } from '../types/project';
import { useProjectStore } from '../store/projectStore';
import { useAgentStore } from '../store/agentStore';
import { orchestratorService } from '../services/orchestratorService';
import { WebContainerManager } from '../utils/webContainer';

export function useProjectInitialization(project: Project | null) {
  const {
    setIsLoading,
    setError,
    setCurrentProject,
    setFiles
  } = useProjectStore();
  const { setSelectedAgent } = useAgentStore();
  const initializationAttempted = useRef(false);

  useEffect(() => {
    if (!project || initializationAttempted.current) return;

    const initializeProject = async () => {
      setIsLoading(true);
      try {
        // Create project workspace
        const workspacePath = `/workspace/${project.id}`;
        await WebContainerManager.createWorkspace(workspacePath);

        // Initialize project files
        for (const file of project.files) {
          await WebContainerManager.writeFile(`${workspacePath}/${file.path}`, file.content);
        }

        // Initialize project context
        const context = await orchestratorService.initializeProject(project);
        
        // Get suggested agents for the project
        const suggestedAgents = await orchestratorService.suggestAgents(project);
        
        // Select the first suggested agent if available
        if (suggestedAgents.length > 0) {
          setSelectedAgent(suggestedAgents[0]);
        }
        
        setCurrentProject(project);
        setFiles(project.files);
        initializationAttempted.current = true;
      } catch (err) {
        console.error('Failed to initialize project:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize project');
      } finally {
        setIsLoading(false);
      }
    };

    initializeProject();
  }, [project?.id]);

  return initializationAttempted.current;
}