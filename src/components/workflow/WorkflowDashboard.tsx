import React from 'react';
import { Project } from '../../types/project';
import { useWorkflow } from '../../hooks/useWorkflow';
import { GitBranch, CheckCircle, Circle, AlertCircle } from 'lucide-react';

interface WorkflowDashboardProps {
  project: Project;
  templateId: string;
}

const WorkflowDashboard: React.FC<WorkflowDashboardProps> = ({ project, templateId }) => {
  const { workflow, isLoading, error, executeStep } = useWorkflow(project, templateId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        Error: {error}
      </div>
    );
  }

  if (!workflow) {
    return (
      <div className="text-center text-gray-400 py-8">
        No workflow selected. Please select a workflow template.
      </div>
    );
  }

  const getStepIcon = (status?: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="text-green-400" size={20} />;
      case 'failed':
        return <AlertCircle className="text-red-400" size={20} />;
      case 'in-progress':
        return <Circle className="text-blue-400 animate-pulse" size={20} />;
      default:
        return <Circle className="text-gray-400" size={20} />;
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center mb-6">
        <GitBranch className="text-blue-400 mr-3" size={24} />
        <h2 className="text-xl font-bold text-white">{workflow.name}</h2>
      </div>

      <div className="space-y-6">
        {workflow.steps.map((step, index) => (
          <div
            key={step.id}
            className={`relative flex items-start ${
              index < workflow.steps.length - 1 ? 'pb-6' : ''
            }`}
          >
            {index < workflow.steps.length - 1 && (
              <div className="absolute top-8 left-[9px] bottom-0 w-0.5 bg-gray-700" />
            )}
            
            <div className="flex-shrink-0 mr-4">
              {getStepIcon(step.status)}
            </div>
            
            <div className="flex-1">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-white">{step.name}</h3>
                    <p className="text-sm text-gray-400">{step.agentType}</p>
                  </div>
                  {step.status !== 'completed' && (
                    <button
                      onClick={() => executeStep(step.id)}
                      disabled={step.status === 'in-progress' || step.dependencies.some(
                        depId => workflow.steps.find(s => s.id === depId)?.status !== 'completed'
                      )}
                      className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Execute
                    </button>
                  )}
                </div>
                
                <div className="text-sm text-gray-300">
                  Actions: {step.actions.join(', ')}
                </div>
                
                {step.dependencies.length > 0 && (
                  <div className="mt-2 text-sm text-gray-400">
                    Dependencies: {step.dependencies.map(depId => (
                      workflow.steps.find(s => s.id === depId)?.name
                    )).join(', ')}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkflowDashboard;