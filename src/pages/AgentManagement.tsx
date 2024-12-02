import React, { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { LLMProvider, Model } from '../types';
import { fetchModels } from '../utils/api';
import AgentForm from '../components/agents/AgentForm';
import AgentList from '../components/agents/AgentList';
import ErrorDisplay from '../components/ErrorDisplay';
import { Agent, AgentFormData, AgentCapabilities } from '../types/agent';

const AgentManagement: React.FC = () => {
  const [agents, setAgents] = useLocalStorage<Agent[]>('agents', []);
  const [providers] = useLocalStorage<LLMProvider[]>('llmProviders', []);
  const [availableModels, setAvailableModels] = useState<Model[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingAgentId, setEditingAgentId] = useState<string | null>(null);
  const [formData, setFormData] = useState<AgentFormData>({
    name: '',
    type: 'orchestrator',
    provider: '',
    model: '',
    autonomyLevel: 'full',
    description: '',
    goal: '',
    systemPrompt: '',
    personality: undefined,
    knowledgeLevel: undefined,
    responseLength: undefined,
    specialization: undefined,
    capabilities: {
      canCreateAgents: false,
      canModifyProject: false,
      canAssignTasks: false,
      canManageWorkflow: false,
      canAccessFiles: false,
      canExecuteCommands: false,
    }
  });

  const handleProviderChange = async (providerId: string) => {
    setIsLoadingModels(true);
    setError(null);
    try {
      const provider = providers.find(p => p.name === providerId);
      if (!provider) {
        throw new Error('Provider not found');
      }
      const models = await fetchModels(provider);
      setAvailableModels(models);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch models');
      setAvailableModels([]);
    } finally {
      setIsLoadingModels(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCapabilitiesChange = (capabilities: AgentCapabilities) => {
    setFormData(prev => ({ ...prev, capabilities }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAgentId) {
      setAgents(prev => prev.map(a => 
        a.id === editingAgentId ? { ...a, ...formData, id: a.id, status: a.status } : a
      ));
      setEditingAgentId(null);
    } else {
      const newAgent: Agent = {
        ...formData,
        id: Date.now().toString(),
        status: 'inactive'
      };
      setAgents(prev => [...prev, newAgent]);
    }
    setFormData({
      name: '',
      type: 'orchestrator',
      provider: '',
      model: '',
      autonomyLevel: 'full',
      description: '',
      goal: '',
      systemPrompt: '',
      personality: undefined,
      knowledgeLevel: undefined,
      responseLength: undefined,
      specialization: undefined,
      capabilities: {
        canCreateAgents: false,
        canModifyProject: false,
        canAssignTasks: false,
        canManageWorkflow: false,
        canAccessFiles: false,
        canExecuteCommands: false,
      }
    });
  };

  const handleEdit = (agent: Agent) => {
    setFormData(agent);
    setEditingAgentId(agent.id);
    if (agent.provider) {
      handleProviderChange(agent.provider);
    }
  };

  const handleDelete = (id: string) => {
    setAgents(prev => prev.filter(a => a.id !== id));
  };

  const toggleAgentStatus = (id: string) => {
    setAgents(prev => prev.map(a => 
      a.id === id ? { ...a, status: a.status === 'active' ? 'inactive' : 'active' } : a
    ));
  };

  return (
    <div className="p-6 bg-gray-900 text-gray-100">
      <h1 className="text-3xl font-semibold mb-6">Agent Management</h1>
      
      {error && (
        <ErrorDisplay
          message={error}
          onDismiss={() => setError(null)}
        />
      )}

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingAgentId ? 'Edit Agent' : 'Create New Agent'}
        </h2>
        <AgentForm
          providers={providers}
          availableModels={availableModels}
          isLoadingModels={isLoadingModels}
          onProviderChange={handleProviderChange}
          onSubmit={handleSubmit}
          onChange={handleInputChange}
          onCapabilitiesChange={handleCapabilitiesChange}
          formData={formData}
          isEditing={!!editingAgentId}
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Existing Agents</h2>
        <AgentList
          agents={agents}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={toggleAgentStatus}
        />
      </div>
    </div>
  );
};

export default AgentManagement;