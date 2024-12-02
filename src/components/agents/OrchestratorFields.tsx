import React from 'react';
import { AgentCapabilities } from '../../types/agent';

interface OrchestratorFieldsProps {
  capabilities: AgentCapabilities;
  onChange: (capabilities: AgentCapabilities) => void;
}

const OrchestratorFields: React.FC<OrchestratorFieldsProps> = ({
  capabilities,
  onChange
}) => {
  const handleCapabilityChange = (key: keyof AgentCapabilities) => {
    onChange({
      ...capabilities,
      [key]: !capabilities[key]
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-200">Orchestrator Capabilities</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="canCreateAgents"
            checked={capabilities.canCreateAgents}
            onChange={() => handleCapabilityChange('canCreateAgents')}
            className="rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
          />
          <label htmlFor="canCreateAgents" className="text-sm text-gray-300">
            Can Create Agents
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="canModifyProject"
            checked={capabilities.canModifyProject}
            onChange={() => handleCapabilityChange('canModifyProject')}
            className="rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
          />
          <label htmlFor="canModifyProject" className="text-sm text-gray-300">
            Can Modify Projects
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="canAssignTasks"
            checked={capabilities.canAssignTasks}
            onChange={() => handleCapabilityChange('canAssignTasks')}
            className="rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
          />
          <label htmlFor="canAssignTasks" className="text-sm text-gray-300">
            Can Assign Tasks
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="canManageWorkflow"
            checked={capabilities.canManageWorkflow}
            onChange={() => handleCapabilityChange('canManageWorkflow')}
            className="rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
          />
          <label htmlFor="canManageWorkflow" className="text-sm text-gray-300">
            Can Manage Workflows
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="canAccessFiles"
            checked={capabilities.canAccessFiles}
            onChange={() => handleCapabilityChange('canAccessFiles')}
            className="rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
          />
          <label htmlFor="canAccessFiles" className="text-sm text-gray-300">
            Can Access Files
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="canExecuteCommands"
            checked={capabilities.canExecuteCommands}
            onChange={() => handleCapabilityChange('canExecuteCommands')}
            className="rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
          />
          <label htmlFor="canExecuteCommands" className="text-sm text-gray-300">
            Can Execute Commands
          </label>
        </div>
      </div>
    </div>
  );
};

export default OrchestratorFields;