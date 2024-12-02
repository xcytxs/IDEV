import React from 'react';
import { AgentFormData, AgentType, PersonalityType, KnowledgeLevel, ResponseLength, AutonomyLevel } from '../types/agent';

interface AgentFormProps {
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  formData: AgentFormData;
  isEditing: boolean;
}

const AgentForm: React.FC<AgentFormProps> = ({
  onSubmit,
  onChange,
  formData,
  isEditing
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-2xl bg-gray-800 p-6 rounded-lg">
      {/* Required Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={onChange}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={onChange}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100"
            required
          >
            <option value="">Select Type</option>
            <option value="orchestrator">Orchestrator</option>
            <option value="developer">Developer</option>
            <option value="researcher">Researcher</option>
            <option value="writer">Writer</option>
            <option value="creative">Creative</option>
            <option value="support">Support</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Provider</label>
          <input
            type="text"
            name="provider"
            value={formData.provider}
            onChange={onChange}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Model</label>
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={onChange}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Autonomy Level</label>
          <select
            name="autonomyLevel"
            value={formData.autonomyLevel}
            onChange={onChange}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100"
            required
          >
            <option value="">Select Autonomy Level</option>
            <option value="full">Full Control</option>
            <option value="limited">Limited</option>
            <option value="supervised">Supervised</option>
          </select>
        </div>
      </div>

      {/* Optional Fields */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">Description</label>
          <textarea
            name="description"
            value={formData.description || ''}
            onChange={onChange}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Goal</label>
          <textarea
            name="goal"
            value={formData.goal || ''}
            onChange={onChange}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100"
            rows={2}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">System Prompt</label>
          <textarea
            name="systemPrompt"
            value={formData.systemPrompt || ''}
            onChange={onChange}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100"
            rows={4}
          />
        </div>

        {/* Additional Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Personality</label>
            <select
              name="personality"
              value={formData.personality || ''}
              onChange={onChange}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100"
            >
              <option value="">Select Personality</option>
              <option value="professional">Professional</option>
              <option value="friendly">Friendly</option>
              <option value="technical">Technical</option>
              <option value="creative">Creative</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Knowledge Level</label>
            <select
              name="knowledgeLevel"
              value={formData.knowledgeLevel || ''}
              onChange={onChange}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100"
            >
              <option value="">Select Knowledge Level</option>
              <option value="expert">Expert</option>
              <option value="intermediate">Intermediate</option>
              <option value="beginner">Beginner</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Response Length</label>
            <select
              name="responseLength"
              value={formData.responseLength || ''}
              onChange={onChange}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100"
            >
              <option value="">Select Response Length</option>
              <option value="concise">Concise</option>
              <option value="detailed">Detailed</option>
              <option value="brief">Brief</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Specialization</label>
            <input
              type="text"
              name="specialization"
              value={formData.specialization || ''}
              onChange={onChange}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100"
              placeholder="e.g., Frontend, ML, Technical Writing"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          {isEditing ? 'Update Agent' : 'Create Agent'}
        </button>
      </div>
    </form>
  );
};

export default AgentForm;