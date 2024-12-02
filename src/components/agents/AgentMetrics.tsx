import React from 'react';
import { BarChart2, Activity, CheckCircle2 } from 'lucide-react';
import { Agent } from '../../types/agent';

interface AgentMetricsProps {
  agent: Agent | null;
}

const AgentMetrics: React.FC<AgentMetricsProps> = ({ agent }) => {
  if (!agent) {
    return null;
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Agent Metrics</h2>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Activity className="text-blue-400 mr-2" size={20} />
            <span>Performance</span>
          </div>
          <div className="w-32 bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-500 rounded-full h-2" 
              style={{ width: '75%' }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <BarChart2 className="text-green-400 mr-2" size={20} />
            <span>Task Completion</span>
          </div>
          <div className="w-32 bg-gray-700 rounded-full h-2">
            <div 
              className="bg-green-500 rounded-full h-2" 
              style={{ width: '60%' }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CheckCircle2 className="text-purple-400 mr-2" size={20} />
            <span>Quality Score</span>
          </div>
          <div className="w-32 bg-gray-700 rounded-full h-2">
            <div 
              className="bg-purple-500 rounded-full h-2" 
              style={{ width: '85%' }}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-700">
        <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {['Task completed', 'Code review', 'Bug fixed'].map((activity, index) => (
            <div key={index} className="flex items-center text-sm">
              <div className="w-2 h-2 rounded-full bg-blue-400 mr-2" />
              <span className="text-gray-300">{activity}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentMetrics;