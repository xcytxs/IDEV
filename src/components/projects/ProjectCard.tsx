import React from 'react';
import { Edit, Trash2, FolderOpen, Play, Settings } from 'lucide-react';
import { Project } from '../../types/project';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  onOpen: (project: Project) => void;
  onDeploy: (project: Project) => void;
  onSettings: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onEdit,
  onDelete,
  onOpen,
  onDeploy,
  onSettings,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-yellow-500/20 text-yellow-300';
      case 'in-progress': return 'bg-blue-500/20 text-blue-300';
      case 'completed': return 'bg-green-500/20 text-green-300';
      case 'archived': return 'bg-gray-500/20 text-gray-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-100">{project.name}</h3>
            <p className="text-gray-400 text-sm mt-1">{project.description}</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onOpen(project)}
              className="text-gray-400 hover:text-gray-200 transition-colors"
              aria-label="Open project"
            >
              <FolderOpen size={18} />
            </button>
            <button
              onClick={() => onEdit(project)}
              className="text-blue-400 hover:text-blue-300 transition-colors"
              aria-label="Edit project"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={() => onSettings(project)}
              className="text-gray-400 hover:text-gray-200 transition-colors"
              aria-label="Project settings"
            >
              <Settings size={18} />
            </button>
            <button
              onClick={() => onDelete(project.id)}
              className="text-red-400 hover:text-red-300 transition-colors"
              aria-label="Delete project"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-400">Type</p>
            <p className="font-medium text-gray-200">{project.type}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Framework</p>
            <p className="font-medium text-gray-200">{project.framework || 'None'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Language</p>
            <p className="font-medium text-gray-200">{project.language || 'None'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Status</p>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
              {project.status}
            </span>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-400">Assigned Agents</p>
              <p className="font-medium text-gray-200">
                {project.assignedAgents?.length || 0} agents
              </p>
            </div>
            <button
              onClick={() => onDeploy(project)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors"
            >
              <Play size={16} />
              <span>Deploy</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;