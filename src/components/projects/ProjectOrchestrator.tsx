import React, { useState } from 'react';
import { Project } from '../../types/project';
import { Agent } from '../../types/agent';
import { useOrchestrator } from '../../hooks/useOrchestrator';
import { useAgentCreation } from '../../hooks/useAgentCreation';
import { Brain, Plus, MessageSquare, Loader } from 'lucide-react';
import AgentChat from '../chat/AgentChat';
import AgentSuggestionList from '../agents/AgentSuggestionList';
import AgentCreationModal from '../agents/AgentCreationModal';

interface ProjectOrchestratorProps {
  project: Project;
  onAgentCreate: (agent: Agent) => void;
  onProjectUpdate: (updates: Partial<Project>) => void;
}

const ProjectOrchestrator: React.FC<ProjectOrchestratorProps> = ({
  project,
  onAgentCreate,
  onProjectUpdate,
}) => {
  const {
    context,
    suggestedAgents,
    isLoading,
    error: orchestratorError,
  } = useOrchestrator(project);

  const { createAgent, isCreating, error: creationError } = useAgentCreation();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showCreationModal, setShowCreationModal] = useState(false);

  const handleAgentSuggestion = async (agent: Agent) => {
    setSelectedAgent(agent);
    setShowCreationModal(true);
  };

  const handleCreateAgent = async (formData: AgentFormData) => {
    try {
      const newAgent = await createAgent(formData);
      onAgentCreate(newAgent);
      setShowCreationModal(false);
      setSelectedAgent(null);
    } catch (error) {
      console.error('Failed to create agent:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader className="animate-spin mr-2" />
        <span>Loading project orchestrator...</span>
      </div>
    );
  }

  if (orchestratorError || creationError) {
    return (
      <div className="text-red-500 p-4">
        Error: {orchestratorError || creationError}
      </div>
    );
  }

  const orchestratorAgent = project.assignedAgents.find(a => a.id === project.orchestratorId);

  if (!orchestratorAgent) {
    return (
      <div className="text-red-500 p-4">
        Error: No orchestrator agent assigned to this project
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Brain className="text-blue-400 mr-2" size={24} />
          <h2 className="text-xl font-semibold">Project Orchestrator</h2>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <Plus size={16} className="mr-2" />
            {showSuggestions ? 'Hide Suggestions' : 'View Suggestions'}
          </button>
          <button
            onClick={() => setShowChat(!showChat)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <MessageSquare size={16} className="mr-2" />
            {showChat ? 'Hide Chat' : 'Show Chat'}
          </button>
        </div>
      </div>

      {showSuggestions && suggestedAgents.length > 0 && (
        <div className="mt-4 space-y-4">
          <h3 className="text-lg font-medium">Suggested Agents</h3>
          <AgentSuggestionList
            agents={suggestedAgents}
            onSelect={handleAgentSuggestion}
          />
        </div>
      )}

      {context && context.decisions.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Recent Decisions</h3>
          <div className="space-y-2">
            {context.decisions.slice(-5).map((decision) => (
              <div
                key={decision.id}
                className="bg-gray-700 rounded p-2 text-sm"
              >
                <span className="font-medium">{decision.type}</span>: {decision.description}
                <span className="text-xs text-gray-400 block mt-1">
                  {new Date(decision.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showChat && (
        <div className="mt-4 border-t border-gray-700 pt-4">
          <AgentChat
            agent={orchestratorAgent}
            project={project}
            onUpdateProject={onProjectUpdate}
          />
        </div>
      )}

      {showCreationModal && (
        <AgentCreationModal
          suggestedAgent={selectedAgent || undefined}
          onClose={() => {
            setShowCreationModal(false);
            setSelectedAgent(null);
          }}
          onSubmit={handleCreateAgent}
        />
      )}
    </div>
  );
};

export default ProjectOrchestrator;