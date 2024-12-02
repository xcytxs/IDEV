import React from 'react';
import { Project, ProjectFile } from '../../../types/project';
import { Agent } from '../../../types/agent';
import ProjectWorkspace from '../ProjectWorkspace';
import { useOrchestrator } from '../../../hooks/useOrchestrator';

interface VideoWorkspaceProps {
  project: Project;
  agent: Agent;
  onSave: (file: ProjectFile) => void;
  onRun: () => void;
  onBuild: () => void;
  onProjectUpdate: (projectId: string, updates: Partial<Project>) => void;
}

const VideoWorkspace: React.FC<VideoWorkspaceProps> = ({
  project,
  agent,
  onSave,
  onRun,
  onBuild,
  onProjectUpdate,
}) => {
  const { context, suggestedAgents } = useOrchestrator(project);

  // Add video-specific features
  const handleProcess = async (videoId: string) => {
    // Handle video processing
  };

  const handleExport = async (format: string) => {
    // Handle video export
  };

  return (
    <ProjectWorkspace
      project={project}
      agent={agent}
      onSave={onSave}
      onRun={handleProcess}
      onBuild={handleExport}
      onProjectUpdate={onProjectUpdate}
      features={{
        timeline: true,
        preview: true,
        effects: true,
        export: true
      }}
    />
  );
};

export default VideoWorkspace;