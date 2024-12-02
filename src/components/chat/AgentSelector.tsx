import React from 'react';
import { Project } from '../../types/project';
import { useAgentStore } from '../../store/agentStore';
import { Users, ChevronDown } from 'lucide-react';

interface AgentSelectorProps {
  project: Project;
}

const AgentSelector: React.FC<AgentSelectorProps> = ({ project }) => {
  const { selectedAgent, setSelectedAgent } = useAgentStore();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-gray-700 p-3 rounded-lg hover:bg-gray-600 transition-colors"
      >
        <div className="flex items-center">
          <Users size={20} className="text-gray-400 mr-2" />
          <span className="text-gray-100">
            {selectedAgent ? selectedAgent.name : 'Select Agent'}
          </span>
        </div>
        <ChevronDown
          size={20}
          className={`text-gray-400 transform transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-lg shadow-lg overflow-hidden z-20">
          {project.assignedAgents.map((agent) => (
            <button
              key={agent.id}
              onClick={() => {
                setSelectedAgent(agent);
                setIsOpen(false);
              }}
              className={`w-full text-left p-3 hover:bg-gray-700 transition-colors ${
                selectedAgent?.id === agent.id ? 'bg-gray-700' : ''
              }`}
            >
              <div className="flex items-center">
                <span className="text-gray-100">{agent.name}</span>
                <span className="ml-2 text-xs text-gray-400">({agent.type})</span>
              </div>
              {agent.description && (
                <p className="text-sm text-gray-400 mt-1">{agent.description}</p>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AgentSelector;