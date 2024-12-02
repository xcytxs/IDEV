import React from 'react';
import { Project } from '../../types/project';
import ProjectCard from './ProjectCard';
import { useProjectStore } from '../../store/projectStore';

interface ProjectListProps {
  onEdit: (project: Project) => void;
  onOpen: (project: Project) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({
  onEdit,
  onOpen
}) => {
  const { projects } = useProjectStore();

  if (!projects?.length) {
    return (
      <div className="text-center py-12 bg-gray-800 rounded-lg">
        <h3 className="text-xl font-medium text-gray-300 mb-2">No Projects Yet</h3>
        <p className="text-gray-400">Create your first project to get started</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
      {projects.map(project => (
        <ProjectCard
          key={project.id}
          project={project}
          onEdit={onEdit}
          onDelete={() => {}}
          onOpen={onOpen}
          onDeploy={() => {}}
          onSettings={() => {}}
        />
      ))}
    </div>
  );
};

export default ProjectList;