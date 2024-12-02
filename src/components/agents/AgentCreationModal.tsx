import React, { useState } from 'react';
import { Agent, AgentType, AgentFormData } from '../../types/agent';
import { X } from 'lucide-react';

interface AgentCreationModalProps {
  suggestedAgent?: Agent;
  onClose: () => void;
  onSubmit: (agent: AgentFormData) => void;
}

const AgentCreationModal: React.FC<AgentCreationModalProps> = ({
  suggestedAgent,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<AgentFormData>({
    name: suggestedAgent?.name || '',
    type: suggestedAgent?.type || 'developer',
    provider: suggestedAgent?.provider || '',
    model: suggestedAgent?.model || '',
    description: suggestedAgent?.description || '',
    goal: suggestedAgent?.goal || '',
    systemPrompt: suggestedAgent?.systemPrompt || '',
    autonomyLevel: suggestedAgent?.autonomyLevel || 'limited',
    capabilities: suggestedAgent?.capabilities || {
      canCreateAgents: false,
      canModifyProject: false,
      canAssignTasks: false,
      canManageWorkflow: false,
      canAccessFiles: false,
      canExecuteCommands: false,
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-100">
            {suggestedAgent ? 'Create Suggested Agent' : 'Create New Agent'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-gray-700 text-gray-100 rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full bg-gray-700 text-gray-100 rounded px-3 py-2"
              required
            >
              <option value="orchestrator">Orchestrator</option>
              <option value="developer">Developer</option>
              <option value="writer">Writer</option>
              <option value="researcher">Researcher</option>
              <option value="creative">Creative</option>
              <option value="support">Support</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-gray-700 text-gray-100 rounded px-3 py-2"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Goal
            </label>
            <textarea
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              className="w-full bg-gray-700 text-gray-100 rounded px-3 py-2"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              System Prompt
            </label>
            <textarea
              name="systemPrompt"
              value={formData.systemPrompt}
              onChange={handleChange}
              className="w-full bg-gray-700 text-gray-100 rounded px-3 py-2"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Autonomy Level
            </label>
            <select
              name="autonomyLevel"
              value={formData.autonomyLevel}
              onChange={handleChange}
              className="w-full bg-gray-700 text-gray-100 rounded px-3 py-2"
              required
            >
              <option value="full">Full Control</option>
              <option value="limited">Limited</option>
              <option value="supervised">Supervised</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Create Agent
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgentCreationModal;