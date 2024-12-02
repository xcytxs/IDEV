import React from 'react';
import { Agent } from '../../types/agent';
import { Brain, Code, TestTube, Settings, CheckCircle, XCircle } from 'lucide-react';
import { useAgentMemory } from '../../hooks/useAgentMemory';
import { Project } from '../../types/project';

interface AgentDetailsProps {
  agent: Agent;
  project: Project;
  onClose: () => void;
}

const AgentDetails: React.FC<AgentDetailsProps> = ({ agent, project, onClose }) => {
  const { memory, isLoading } = useAgentMemory(agent, project);

  const getAgentIcon = () => {
    switch (agent.type) {
      case 'orchestrator':
        return <Brain className="text-purple-400" size={24} />;
      case 'developer':
        return <Code className="text-blue-400" size={24} />;
      case 'support':
        return <TestTube className="text-green-400" size={24} />;
      default:
        return <Settings className="text-yellow-400" size={24} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center">
              {getAgentIcon()}
              <div className="ml-3">
                <h2 className="text-xl font-bold text-white">{agent.name}</h2>
                <p className="text-gray-400">{agent.type}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-300"
            >
              <XCircle size={24} />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Details</h3>
              <div className="bg-gray-700 rounded-lg p-4 space-y-2">
                <p className="text-gray-300">{agent.description}</p>
                <p className="text-gray-300">Goal: {agent.goal}</p>
                <div className="flex items-center mt-2">
                  <span className={`px-2 py-1 rounded text-sm ${
                    agent.status === 'active'
                      ? 'bg-green-900 text-green-300'
                      : 'bg-red-900 text-red-300'
                  }`}>
                    {agent.status}
                  </span>
                  <span className="ml-2 text-gray-400">
                    {agent.autonomyLevel} autonomy
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-white mb-2">Capabilities</h3>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(agent.capabilities || {}).map(([key, value]) => (
                    <div key={key} className="flex items-center">
                      {value ? (
                        <CheckCircle className="text-green-400 mr-2" size={16} />
                      ) : (
                        <XCircle className="text-red-400 mr-2" size={16} />
                      )}
                      <span className="text-gray-300">
                        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {memory && (
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Recent Activity</h3>
                <div className="space-y-2">
                  {memory.knowledge.slice(0, 5).map((k, i) => (
                    <div key={i} className="bg-gray-700 p-3 rounded-lg">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">{k.type}</span>
                        <span className="text-gray-500">
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
        </div>
      </div>
    </div>
  );
};

export default AgentDetails;