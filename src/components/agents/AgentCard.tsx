import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Agent } from '../../types/agent';

interface AgentCardProps {
  agent: Agent;
  onEdit: (agent: Agent) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

const AgentCard: React.FC<AgentCardProps> = ({
  agent,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold">{agent.name}</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(agent)}
            className="text-blue-500 hover:text-blue-600"
            aria-label="Edit agent"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => onDelete(agent.id)}
            className="text-red-500 hover:text-red-600"
            aria-label="Delete agent"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        <p><span className="font-medium">Type:</span> {agent.type}</p>
        <p><span className="font-medium">Provider:</span> {agent.provider}</p>
        <p><span className="font-medium">Model:</span> {agent.model}</p>
        {agent.personality && (
          <p><span className="font-medium">Personality:</span> {agent.personality}</p>
        )}
        {agent.knowledgeLevel && (
          <p><span className="font-medium">Knowledge Level:</span> {agent.knowledgeLevel}</p>
        )}
        {agent.responseLength && (
          <p><span className="font-medium">Response Length:</span> {agent.responseLength}</p>
        )}
        {agent.autonomyLevel && (
          <p><span className="font-medium">Autonomy Level:</span> {agent.autonomyLevel}</p>
        )}
        <p><span className="font-medium">Status:</span> {agent.status}</p>
      </div>
      
      <button
        onClick={() => onToggleStatus(agent.id)}
        className={`mt-4 w-full py-2 px-4 rounded-md transition-colors ${
          agent.status === 'active'
            ? 'bg-red-500 hover:bg-red-600 text-white'
            : 'bg-green-500 hover:bg-green-600 text-white'
        }`}
      >
        {agent.status === 'active' ? 'Deactivate' : 'Activate'}
      </button>
    </div>
  );
};

export default AgentCard;