import React from 'react';
import { Agent } from '../../types/agent';
import { Brain, Code, PenTool, BookOpen } from 'lucide-react';

interface AgentSuggestionListProps {
  agents: Agent[];
  onSelect: (agent: Agent) => void;
}

const AgentSuggestionList: React.FC<AgentSuggestionListProps> = ({ agents, onSelect }) => {
  const getAgentIcon = (type: string) => {
    switch (type) {
      case 'orchestrator':
        return <Brain className="text-purple-400" />;
      case 'developer':
        return <Code className="text-blue-400" />;
      case 'writer':
        return <PenTool className="text-green-400" />;
      default:
        return <BookOpen className="text-gray-400" />;
    }
  };

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {agents.map((agent) => (
        <div
          key={agent.id}
          className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer"
          onClick={() => onSelect(agent)}
        >
          <div className="flex items-center gap-2 mb-2">
            {getAgentIcon(agent.type)}
            <h3 className="text-lg font-medium text-gray-100">{agent.name}</h3>
          </div>
          <p className="text-sm text-gray-300 mb-3">{agent.description}</p>
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">
              {agent.type}
            </span>
            {agent.specialization && (
              <span className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">
                {agent.specialization}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AgentSuggestionList;