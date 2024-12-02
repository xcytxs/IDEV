import React from 'react';
import { Project, ProjectFile } from '../../../types/project';
import { Agent } from '../../../types/agent';
import ProjectWorkspace from '../ProjectWorkspace';
import { useOrchestrator } from '../../../hooks/useOrchestrator';

interface CodeWorkspaceProps {
  project: Project;
  agent: Agent;
  onSave: (file: ProjectFile) => void;
  onRun: () => void;
  onBuild: () => void;
  onProjectUpdate: (projectId: string, updates: Partial<Project>) => void;
}

const CodeWorkspace: React.FC<CodeWorkspaceProps> = ({
  project,
  agent,
  onSave,
  onRun,
  onBuild,
  onProjectUpdate,
}) => {
  const { context, suggestedAgents } = useOrchestrator(project);

  // Add code-specific features and tools
  const handleRun = async () => {
    // Execute project-specific run command
    await onRun();
  };

  const handleBuild = async () => {
    // Execute project-specific build command
    await onBuild();
  };

  return (
    <ProjectWorkspace
      project={project}
      agent={agent}
      onSave={onSave}
      onRun={handleRun}
      onBuild={handleBuild}
      onProjectUpdate={onProjectUpdate}
      features={{
        terminal: true,
        debugger: true,
        preview: true,
        testing: true
      }}
    />
  );
};

export default CodeWorkspace;