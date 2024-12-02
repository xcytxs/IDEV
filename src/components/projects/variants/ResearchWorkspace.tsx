import React from 'react';
import { Project, ProjectFile } from '../../../types/project';
import { Agent } from '../../../types/agent';
import ProjectWorkspace from '../ProjectWorkspace';
import { useOrchestrator } from '../../../hooks/useOrchestrator';

interface ResearchWorkspaceProps {
  project: Project;
  agent: Agent;
  onSave: (file: ProjectFile) => void;
  onRun: () => void;
  onBuild: () => void;
  onProjectUpdate: (projectId: string, updates: Partial<Project>) => void;
}

const ResearchWorkspace: React.FC<ResearchWorkspaceProps> = ({
  project,
  agent,
  onSave,
  onRun,
  onBuild,
  onProjectUpdate,
}) => {
  const { context, suggestedAgents } = useOrchestrator(project);

  // Add research-specific features
  const handleCompile = async () => {
    // Handle LaTeX compilation
  };

  const handleCitations = async () => {
    // Handle citation management
  };

  return (
    <ProjectWorkspace
      project={project}
      agent={agent}
      onSave={onSave}
      onRun={handleCompile}
      onBuild={handleCitations}
      onProjectUpdate={onProjectUpdate}
      features={{
        bibliography: true,
        citations: true,
        preview: true,
        export: true
      }}
    />
  );
};

export default ResearchWorkspace;