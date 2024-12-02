import React from 'react';
import { Project, ProjectFile } from '../../../types/project';
import { Agent } from '../../../types/agent';
import ProjectWorkspace from '../ProjectWorkspace';
import { useOrchestrator } from '../../../hooks/useOrchestrator';

interface DocumentationWorkspaceProps {
  project: Project;
  agent: Agent;
  onSave: (file: ProjectFile) => void;
  onRun: () => void;
  onBuild: () => void;
  onProjectUpdate: (projectId: string, updates: Partial<Project>) => void;
}

const DocumentationWorkspace: React.FC<DocumentationWorkspaceProps> = ({
  project,
  agent,
  onSave,
  onRun,
  onBuild,
  onProjectUpdate,
}) => {
  const { context, suggestedAgents } = useOrchestrator(project);

  // Add documentation-specific features
  const handlePreview = async () => {
    // Handle documentation preview
  };

  const handlePublish = async () => {
    // Handle documentation publishing
  };

  return (
    <ProjectWorkspace
      project={project}
      agent={agent}
      onSave={onSave}
      onRun={handlePreview}
      onBuild={handlePublish}
      onProjectUpdate={onProjectUpdate}
      features={{
        outline: true,
        search: true,
        preview: true,
        versioning: true
      }}
    />
  );
};

export default DocumentationWorkspace;