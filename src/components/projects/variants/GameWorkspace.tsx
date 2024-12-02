import React from 'react';
import { Project, ProjectFile } from '../../../types/project';
import { Agent } from '../../../types/agent';
import ProjectWorkspace from '../ProjectWorkspace';
import { useOrchestrator } from '../../../hooks/useOrchestrator';

interface GameWorkspaceProps {
  project: Project;
  agent: Agent;
  onSave: (file: ProjectFile) => void;
  onRun: () => void;
  onBuild: () => void;
  onProjectUpdate: (projectId: string, updates: Partial<Project>) => void;
}

const GameWorkspace: React.FC<GameWorkspaceProps> = ({
  project,
  agent,
  onSave,
  onRun,
  onBuild,
  onProjectUpdate,
}) => {
  const { context, suggestedAgents } = useOrchestrator(project);

  // Add game-specific features
  const handlePlayTest = async () => {
    // Handle game testing
  };

  const handleBuild = async (platform: string) => {
    // Handle game build for specific platform
  };

  return (
    <ProjectWorkspace
      project={project}
      agent={agent}
      onSave={onSave}
      onRun={handlePlayTest}
      onBuild={handleBuild}
      onProjectUpdate={onProjectUpdate}
      features={{
        sceneEditor: true,
        assetManager: true,
        preview: true,
        debug: true
      }}
    />
  );
};

export default GameWorkspace;