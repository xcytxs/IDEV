import React from 'react';
import { Brain, Code, TestTube, Search, CheckCircle, XCircle } from 'lucide-react';
import { Agent } from '../../types/agent';
import { useAgentStore } from '../../store/agentStore';

interface AgentListProps {
  agents: Agent[];
}

const AgentList: React.FC<AgentListProps> = ({ agents }) => {
  const { setSelectedAgent, selectedAgent } = useAgentStore();

  const getAgentIcon = (type: string) => {
    switch (type) {
      case 'orchestrator':
        return <Brain className="text-purple-400" size={20} />;
      case 'development':
        return <Code className="text-blue-400" size={20} />;
      case 'testing':
        return <TestTube className="text-green-400" size={20} />;
      case 'research':
        return <Search className="text-yellow-400" size={20} />;
      default:
        return <Brain className="text-gray-400" size={20} />;
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Active Agents</h2>
      <div className="space-y-4">
        {agents.map(agent => (
          <div
            key={agent.id}
            onClick={() => setSelectedAgent(agent)}
            className={`cursor-pointer p-4 rounded-lg transition-colors ${
              selectedAgent?.id === agent.id
                ? 'bg-gray-700 border border-blue-500'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                {getAgentIcon(agent.type)}
                <span className="ml-2 font-medium">{agent.name}</span>
              </div>
              {agent.status === 'active' ? (
                <CheckCircle className="text-green-400" size={16} />
              ) : (
                <XCircle className="text-red-400" size={16} />
              )}
            </div>
            <p className="text-sm text-gray-400">{agent.type}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentList;