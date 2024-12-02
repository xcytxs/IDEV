import React from 'react';
import { useTeam } from '../../hooks/useTeam';
import { Project } from '../../types/project';
import { Users, Brain, Code, TestTube } from 'lucide-react';

interface TeamDashboardProps {
  project: Project;
}

const TeamDashboard: React.FC<TeamDashboardProps> = ({ project }) => {
  const { team, isLoading, error, memory } = useTeam(project);

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
        <h2 className="text-2xl font-bold text-white mb-2">Development Team</h2>
        <p className="text-gray-400">Project: {project.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {team.map(agent => (
          <div key={agent.id} className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center mb-4">
              {agent.type === 'orchestrator' ? (
                <Brain className="text-purple-400 mr-3" size={24} />
              ) : agent.type === 'developer' ? (
                <Code className="text-blue-400 mr-3" size={24} />
              ) : (
                <TestTube className="text-green-400 mr-3" size={24} />
              )}
              <div>
                <h3 className="text-lg font-semibold text-white">{agent.name}</h3>
                <p className="text-sm text-gray-400">{agent.type}</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4">{agent.description}</p>
            <div className="space-y-2">
              <div className="text-sm text-gray-400">
                <span className="font-medium">Status:</span>{' '}
                <span className={agent.status === 'active' ? 'text-green-400' : 'text-red-400'}>
                  {agent.status}
                </span>
              </div>
              <div className="text-sm text-gray-400">
                <span className="font-medium">Autonomy:</span> {agent.autonomyLevel}
              </div>
            </div>
          </div>
        ))}
      </div>

      {memory && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-white mb-4">Team Activity</h3>
          <div className="space-y-4">
            {memory.knowledge.slice(0, 5).map((k, i) => (
              <div key={i} className="bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-400">{k.type}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(k.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-300">{k.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};