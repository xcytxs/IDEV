import React, { useEffect, useState } from 'react';
import { Project, ProjectFile } from '../../types/project';
import { Agent } from '../../types/agent';
import { orchestratorService } from '../../services/orchestratorService';
import ProjectOrchestrator from './ProjectOrchestrator';
import {
  CodeWorkspace,
  BookWorkspace,
  ImageWorkspace,
  VideoWorkspace,
  GameWorkspace,
  ResearchWorkspace,
  DocumentationWorkspace
} from './variants';
import ErrorDisplay from '../ErrorDisplay';

interface ProjectWorkspaceManagerProps {
  project: Project;
  agent: Agent;
  onSave: (file: ProjectFile) => void;
  onRun: () => void;
  onBuild: () => void;
  onProjectUpdate: (projectId: string, updates: Partial<Project>) => void;
}

const ProjectWorkspaceManager: React.FC<ProjectWorkspaceManagerProps> = ({
  project,
  agent,
  onSave,
  onRun,
  onBuild,
  onProjectUpdate
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeWorkspace = async () => {
      try {
        await orchestratorService.initializeProject(project);
        setIsInitialized(true);
        setError(null);
      } catch (err) {
        console.error('Failed to initialize workspace:', err);
        setError('Failed to initialize workspace. Please try again.');
        setIsInitialized(false);
      }
    };

    initializeWorkspace();
  }, [project.id]);

  const handleProjectUpdate = (updates: Partial<Project>) => {
    onProjectUpdate(project.id, updates);
  };

  if (error) {
    return (
      <ErrorDisplay
        message={error}
        onDismiss={() => setError(null)}
      />
    );
  }

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Initializing workspace...</p>
        </div>
      </div>
    );
  }

  const renderWorkspace = () => {
    const props = {
      project,
      agent,
      onSave,
      onRun,
      onBuild,
      onProjectUpdate: handleProjectUpdate
    };

    switch (project.type) {
      case 'code':
        return <CodeWorkspace {...props} />;
      case 'book':
        return <BookWorkspace {...props} />;
      case 'image':
        return <ImageWorkspace {...props} />;
      case 'video':
        return <VideoWorkspace {...props} />;
      case 'game':
        return <GameWorkspace {...props} />;
      case 'research':
        return <ResearchWorkspace {...props} />;
      case 'documentation':
        return <DocumentationWorkspace {...props} />;
      default:
        return <CodeWorkspace {...props} />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <ProjectOrchestrator
        project={project}
        onAgentCreate={(newAgent) => {
          handleProjectUpdate({
            assignedAgents: [...project.assignedAgents, newAgent]
          });
        }}
        onProjectUpdate={handleProjectUpdate}
      />
      <div className="flex-1 overflow-hidden">
        {renderWorkspace()}
      </div>
    </div>
  );
};

export default ProjectWorkspaceManager;