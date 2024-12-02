import React from 'react';
import { Project, ProjectFile } from '../../../types/project';
import { Agent } from '../../../types/agent';
import ProjectWorkspace from '../ProjectWorkspace';
import { useOrchestrator } from '../../../hooks/useOrchestrator';

interface ImageWorkspaceProps {
  project: Project;
  agent: Agent;
  onSave: (file: ProjectFile) => void;
  onRun: () => void;
  onBuild: () => void;
  onProjectUpdate: (projectId: string, updates: Partial<Project>) => void;
}

const ImageWorkspace: React.FC<ImageWorkspaceProps> = ({
  project,
  agent,
  onSave,
  onRun,
  onBuild,
  onProjectUpdate,
}) => {
  const { context, suggestedAgents } = useOrchestrator(project);

  // Add image-specific features
  const handleGenerate = async (prompt: string) => {
    // Handle image generation
  };

  const handleEdit = async (imageId: string, edits: any) => {
    // Handle image editing
  };

  return (
    <ProjectWorkspace
      project={project}
      agent={agent}
      onSave={onSave}
      onRun={handleGenerate}
      onBuild={handleEdit}
      onProjectUpdate={onProjectUpdate}
      features={{
        canvas: true,
        gallery: true,
        tools: true,
        export: true
      }}
    />
  );
};

export default ImageWorkspace;