import { create } from 'zustand';
import { Agent } from '../types/agent';

interface AgentState {
  agents: Agent[];
  selectedAgent: Agent | null;
  isLoading: boolean;
  error: string | null;
  setAgents: (agents: Agent[]) => void;
  setSelectedAgent: (agent: Agent | null) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addAgent: (agent: Agent) => void;
  updateAgent: (agent: Agent) => void;
  removeAgent: (agentId: string) => void;
  initializeGameAgents: () => void;
}

export const useAgentStore = create<AgentState>((set) => ({
  agents: [],
  selectedAgent: null,
  isLoading: false,
  error: null,
  setAgents: (agents) => set({ agents }),
  setSelectedAgent: (agent) => set({ selectedAgent: agent }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  addAgent: (agent) =>
    set((state) => ({ agents: [...state.agents, agent] })),
  updateAgent: (agent) =>
    set((state) => ({
      agents: state.agents.map((a) => (a.id === agent.id ? agent : a)),
      selectedAgent: state.selectedAgent?.id === agent.id ? agent : state.selectedAgent,
    })),
  removeAgent: (agentId) =>
    set((state) => ({
      agents: state.agents.filter((a) => a.id !== agentId),
      selectedAgent: state.selectedAgent?.id === agentId ? null : state.selectedAgent,
    })),
  initializeGameAgents: () => {
    const gameOrchestrator: Agent = {
      id: 'game-orchestrator',
      name: 'Game Development Orchestrator',
      type: 'orchestrator',
      provider: 'system',
      model: 'game-dev-v1',
      description: 'Manages game development workflow and coordinates other agents',
      goal: 'Coordinate game development process and ensure quality implementation',
      autonomyLevel: 'full',
      status: 'active',
      capabilities: {
        canCreateAgents: true,
        canModifyProject: true,
        canAssignTasks: true,
        canManageWorkflow: true,
        canAccessFiles: true,
        canExecuteCommands: true
      }
    };

    const gameDevAgent: Agent = {
      id: 'game-developer',
      name: 'Game Developer',
      type: 'developer',
      provider: 'system',
      model: 'game-dev-v1',
      description: 'Implements game mechanics and core functionality',
      goal: 'Create robust and efficient game implementation',
      autonomyLevel: 'limited',
      status: 'active',
      capabilities: {
        canModifyProject: true,
        canAccessFiles: true,
        canExecuteCommands: true
      }
    };

    set((state) => ({
      agents: [...state.agents, gameOrchestrator, gameDevAgent],
      selectedAgent: gameOrchestrator
    }));
  }
}));