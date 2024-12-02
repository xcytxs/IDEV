import React from 'react';
import { Agent } from '../../types/agent';
import { Brain, Code, TestTube, Zap } from 'lucide-react';

interface TeamOverviewProps {
  agents: Agent[];
  onAgentClick?: (agent: Agent) => void;
}

const TeamOverview: React.FC<TeamOverviewProps> = ({ agents, onAgentClick }) => {
  const getAgentIcon = (type: string) => {
    switch (type) {
      case 'orchestrator':
        return <Brain className="text-purple-400" />;
      case 'developer':
        return <Code className="text-blue-400" />;
      case 'support':
        return <TestTube className="text-green-400" />;
      default:
        return <Zap className="text-yellow-400" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {agents.map(agent => (
        <div
          key={agent.id}
          onClick={() => onAgentClick?.(agent)}
          className={`bg-gray-800 rounded-lg p-4 ${
            onAgentClick ? 'cursor-pointer hover:bg-gray-700' : ''
          }`}
        >
          <div className="flex items-center mb-3">
            <div className="mr-3">{getAgentIcon(agent.type)}</div>
            <div>
              <h3 className="font-medium text-gray-100">{agent.name}</h3>
              <p className="text-sm text-gray-400">{agent.type}</p>
            </div>
          </div>
          
          <p className="text-sm text-gray-300 mb-3">{agent.description}</p>
          
          <div className="flex items-center justify-between text-sm">
            <span className={`px-2 py-1 rounded ${
              agent.status === 'active' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
            }`}>
              {agent.status}
            </span>
            <span className="text-gray-400">
              {agent.autonomyLevel} autonomy
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeamOverview;