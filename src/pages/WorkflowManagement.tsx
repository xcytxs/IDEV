import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit, Trash2, ArrowRight } from 'lucide-react';

interface WorkflowStep {
  id: string;
  name: string;
  agentId: string;
  action: string;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
}

const WorkflowManagement: React.FC = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [newWorkflow, setNewWorkflow] = useState<Partial<Workflow>>({});
  const [editingWorkflowId, setEditingWorkflowId] = useState<string | null>(null);

  useEffect(() => {
    // Load workflows from localStorage
    const storedWorkflows = localStorage.getItem('workflows');
    if (storedWorkflows) {
      setWorkflows(JSON.parse(storedWorkflows));
    }
  }, []);

  useEffect(() => {
    // Save workflows to localStorage whenever the workflows state changes
    localStorage.setItem('workflows', JSON.stringify(workflows));
  }, [workflows]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewWorkflow(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingWorkflowId) {
      setWorkflows(prev => prev.map(w => w.id === editingWorkflowId ? { ...w, ...newWorkflow } as Workflow : w));
      setEditingWorkflowId(null);
    } else {
      setWorkflows(prev => [...prev, { ...newWorkflow, id: Date.now().toString(), steps: [] } as Workflow]);
    }
    setNewWorkflow({});
  };

  const handleEdit = (workflow: Workflow) => {
    setNewWorkflow(workflow);
    setEditingWorkflowId(workflow.id);
  };

  const handleDelete = (id: string) => {
    setWorkflows(prev => prev.filter(w => w.id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-4">Workflow Management</h1>
      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          name="name"
          value={newWorkflow.name || ''}
          onChange={handleInputChange}
          placeholder="Workflow Name"
          className="mr-2 p-2 border rounded"
          required
        />
        <textarea
          name="description"
          value={newWorkflow.description || ''}
          onChange={handleInputChange}
          placeholder="Workflow Description"
          className="mr-2 p-2 border rounded"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          {editingWorkflowId ? 'Update Workflow' : 'Create Workflow'}
        </button>
      </form>
      <ul>
        {workflows.map(workflow => (
          <li key={workflow.id} className="mb-4 p-4 border rounded">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-semibold">{workflow.name}</h3>
              <div>
                <button onClick={() => handleEdit(workflow)} className="mr-2 text-blue-500"><Edit size={18} /></button>
                <button onClick={() => handleDelete(workflow.id)} className="text-red-500"><Trash2 size={18} /></button>
              </div>
            </div>
            <p className="mb-2">{workflow.description}</p>
            <h4 className="font-semibold mb-2">Steps:</h4>
            <div className="flex flex-wrap">
              {workflow.steps.map((step, index) => (
                <div key={step.id} className="flex items-center mb-2">
                  <div className="bg-gray-200 p-2 rounded">
                    <p className="font-semibold">{step.name}</p>
                    <p>Agent: {step.agentId}</p>
                    <p>Action: {step.action}</p>
                  </div>
                  {index < workflow.steps.length - 1 && <ArrowRight className="mx-2" />}
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WorkflowManagement;