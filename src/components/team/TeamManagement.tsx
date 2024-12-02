import React, { useState } from 'react';
import { Project } from '../../types/project';
import { useTeam } from '../../hooks/useTeam';
import TeamSelector from './TeamSelector';
import TeamOverview from './TeamOverview';
import WorkflowDashboard from '../workflow/WorkflowDashboard';
import { Users, GitBranch } from 'lucide-react';

interface TeamManagementProps {
  project: Project;
}

const TeamManagement: React.FC<TeamManagementProps> = ({ project }) => {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [activeTab, setActiveTab] = useState<'team' | 'workflow'>('team');
  const { team, isLoading, error } = useTeam(project);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-4">Team Management</h2>
        <TeamSelector onSelect={setSelectedTemplate} selectedId={selectedTemplate} />
      </div>

      <div className="mb-6">
        <div className="flex space-x-4 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('team')}
            className={`flex items-center px-4 py-2 -mb-px ${
              activeTab === 'team'
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <Users size={20} className="mr-2" />
            Team Members
          </button>
          <button
            onClick={() => setActiveTab('workflow')}
            className={`flex items-center px-4 py-2 -mb-px ${
              activeTab === 'workflow'
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <GitBranch size={20} className="mr-2" />
            Workflow
          </button>
        </div>
      </div>

      <div className="mt-6">
        {activeTab === 'team' ? (
          <TeamOverview agents={team} />
        ) : (
          selectedTemplate && (
            <WorkflowDashboard
              project={project}
              templateId={selectedTemplate}
            />
          )
        )}
      </div>
    </div>
  );
};

export default TeamManagement;