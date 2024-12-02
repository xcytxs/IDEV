import React from 'react';
import { Brain, Code, TestTube, Search, Users } from 'lucide-react';
import AgentMetrics from './AgentMetrics';
import AgentList from './AgentList';
import AgentWorkspace from './AgentWorkspace';
import { useAgentStore } from '../../store/agentStore';

const AgentDashboard: React.FC = () => {
  const { agents, selectedAgent } = useAgentStore();

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Agent Ecosystem</h1>
          <div className="flex space-x-4">
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center">
              <Users className="mr-2" size={20} />
              Add Agent
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <Brain className="text-purple-400 mr-2" size={24} />
              <h3 className="text-lg font-semibold">Orchestrator Agents</h3>
            </div>
            <p className="text-2xl font-bold">{agents.filter(a => a.type === 'orchestrator').length}</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <Code className="text-blue-400 mr-2" size={24} />
              <h3 className="text-lg font-semibold">Development Agents</h3>
            </div>
            <p className="text-2xl font-bold">{agents.filter(a => a.type === 'development').length}</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <TestTube className="text-green-400 mr-2" size={24} />
              <h3 className="text-lg font-semibold">Testing Agents</h3>
            </div>
            <p className="text-2xl font-bold">{agents.filter(a => a.type === 'testing').length}</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <Search className="text-yellow-400 mr-2" size={24} />
              <h3 className="text-lg font-semibold">Research Agents</h3>
            </div>
            <p className="text-2xl font-bold">{agents.filter(a => a.type === 'research').length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <AgentWorkspace agent={selectedAgent} />
          </div>
          <div className="space-y-8">
            <AgentList agents={agents} />
            <AgentMetrics agent={selectedAgent} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;