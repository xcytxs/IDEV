import React from 'react';
import { Agent } from '../../types/agent';
import { Shield, Zap, Database, Terminal } from 'lucide-react';

interface AgentSettingsProps {
  agent: Agent;
}

const AgentSettings: React.FC<AgentSettingsProps> = ({ agent }) => {
  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Agent Configuration</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-300">Name</label>
              <input
                type="text"
                value={agent.name}
                className="mt-1 w-full bg-gray-600 rounded-md border-gray-500 text-gray-100"
                readOnly
              />
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-300">Type</label>
              <input
                type="text"
                value={agent.type}
                className="mt-1 w-full bg-gray-600 rounded-md border-gray-500 text-gray-100"
                readOnly
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Capabilities</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(agent.capabilities || {}).map(([key, value]) => (
              <div key={key} className="flex items-center bg-gray-700 p-4 rounded-lg">
                <input
                  type="checkbox"
                  checked={value}
                  className="rounded border-gray-500 text-blue-500 focus:ring-blue-500"
                  readOnly
                />
                <span className="ml-2 text-gray-300">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Security & Permissions</h3>
          <div className="space-y-4">
            <div className="flex items-center bg-gray-700 p-4 rounded-lg">
              <Shield className="text-blue-400 mr-3" size={20} />
              <div>
                <p className="font-medium">Access Level</p>
                <p className="text-sm text-gray-400">Restricted to assigned projects</p>
              </div>
            </div>
            <div className="flex items-center bg-gray-700 p-4 rounded-lg">
              <Terminal className="text-green-400 mr-3" size={20} />
              <div>
                <p className="font-medium">Command Execution</p>
                <p className="text-sm text-gray-400">Limited to safe commands</p>
              </div>
            </div>
            <div className="flex items-center bg-gray-700 p-4 rounded-lg">
              <Database className="text-purple-400 mr-3" size={20} />
              <div>
                <p className="font-medium">Data Access</p>
                <p className="text-sm text-gray-400">Read-only for sensitive data</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Performance Settings</h3>
          <div className="space-y-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span>Response Time</span>
                <span className="text-blue-400">Fast</span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div className="bg-blue-500 rounded-full h-2 w-3/4"></div>
              </div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span>Resource Usage</span>
                <span className="text-green-400">Efficient</span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div className="bg-green-500 rounded-full h-2 w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentSettings;