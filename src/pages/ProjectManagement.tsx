import React, { useState } from 'react';
import { useProjectStore } from '../store/projectStore';
import { Project } from '../types/project';
import ProjectForm from '../components/projects/ProjectForm';
import ProjectList from '../components/projects/ProjectList';
import ProjectWorkspaceManager from '../components/projects/ProjectWorkspaceManager';
import TeamManagement from '../components/team/TeamManagement';
import { createProjectFromTemplate } from '../templates/projectTemplates';
import { orchestratorService } from '../services/orchestratorService';
import { ProjectManager } from '../services/projectManager'; // Import ProjectManager
import ErrorDisplay from '../components/ErrorDisplay';

const ProjectManagement: React.FC = () => {
  const {
    currentProject,
    setCurrentProject,
    isLoading,
    setIsLoading, // Add setIsLoading
    error,
    setError
  } = useProjectStore();
  
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showTeamManagement, setShowTeamManagement] = useState(false);

  const handleCreateProject = async (formData: Partial<Project>) => {
    try {
      setIsLoading(true);
      
      // Create project from template
      const newProject = createProjectFromTemplate(
        formData.name || 'New Project',
        formData.description || '',
        formData.type || 'code'
      );

      // Validate project data
      if (!newProject.id || !newProject.name) {
        throw new Error('Invalid project data');
      }

      // Save project first
      await ProjectManager.saveProject(newProject);

      // Initialize project workspace and files
      try {
        await orchestratorService.initializeProject(newProject);
        setCurrentProject(newProject);
        setEditingProject(null);
      } catch (initError) {
        // If initialization fails, delete the project
        await ProjectManager.deleteProject(newProject.id);
        throw initError;
      }
    } catch (err) {
      console.error('Project creation failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to create project');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 h-screen bg-gray-900 text-gray-100 overflow-hidden">
      {error && (
        <ErrorDisplay
          message={error}
          onDismiss={() => setError(null)}
        />
      )}

      {currentProject ? (
        <div className="h-full flex flex-col">
          <div className="mb-4 flex justify-between items-center">
            <h1 className="text-3xl font-semibold">{currentProject.name}</h1>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowTeamManagement(!showTeamManagement)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {showTeamManagement ? 'Show Project' : 'Manage Team'}
              </button>
              <button
                onClick={() => setCurrentProject(null)}
                className="px-4 py-2 text-gray-400 hover:text-gray-200"
              >
                Back to Projects
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-hidden">
            {showTeamManagement ? (
              <TeamManagement project={currentProject} />
            ) : (
              <ProjectWorkspaceManager
                project={currentProject}
                onProjectUpdate={(updates) => {
                  setCurrentProject({ ...currentProject, ...updates });
                }}
              />
            )}
          </div>
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-semibold mb-6">Project Management</h1>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {editingProject ? 'Edit Project' : 'Create New Project'}
            </h2>
            <ProjectForm
              onSubmit={handleCreateProject}
              isEditing={!!editingProject}
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Projects</h2>
            <ProjectList
              onEdit={setEditingProject}
              onOpen={setCurrentProject}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ProjectManagement;