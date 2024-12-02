import React from 'react';
import { Project, ProjectFile } from '../../../types/project';
import { Agent } from '../../../types/agent';
import ProjectWorkspace from '../ProjectWorkspace';
import { useOrchestrator } from '../../../hooks/useOrchestrator';

interface BookWorkspaceProps {
  project: Project;
  agent: Agent;
  onSave: (file: ProjectFile) => void;
  onRun: () => void;
  onBuild: () => void;
  onProjectUpdate: (projectId: string, updates: Partial<Project>) => void;
}

const BookWorkspace: React.FC<BookWorkspaceProps> = ({
  project,
  agent,
  onSave,
  onRun,
  onBuild,
  onProjectUpdate,
}) => {
  const { context, suggestedAgents } = useOrchestrator(project);

  // Add book-specific features
  const handleExport = async (format: 'pdf' | 'epub' | 'mobi') => {
    // Handle book export
  };

  return (
    <ProjectWorkspace
      project={project}
      agent={agent}
      onSave={onSave}
      onRun={handleExport}
      onBuild={onBuild}
      onProjectUpdate={onProjectUpdate}
      features={{
        outline: true,
        chapters: true,
        preview: true,
        export: true
      }}
    />
  );
};

export default BookWorkspace;