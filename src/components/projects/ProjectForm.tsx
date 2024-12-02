import React from 'react';
import { Project } from '../../types/project';

interface ProjectFormProps {
  onSubmit: (formData: Partial<Project>) => void;
  isEditing: boolean;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  onSubmit,
  isEditing
}) => {
  const [formData, setFormData] = React.useState<Partial<Project>>({
    name: '',
    description: '',
    type: 'code',
    category: 'development',
    framework: 'react',
    language: 'typescript',
    status: 'planning'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-gray-800 p-6 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300">Project Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100"
            required
          >
            <option value="code">Code Project</option>
            <option value="game">Game Project</option>
            <option value="book">Book Project</option>
            <option value="documentation">Documentation</option>
          </select>
        </div>

        {formData.type === 'code' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-300">Framework</label>
              <select
                name="framework"
                value={formData.framework}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100"
              >
                <option value="react">React</option>
                <option value="vue">Vue</option>
                <option value="angular">Angular</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">Language</label>
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100"
              >
                <option value="typescript">TypeScript</option>
                <option value="javascript">JavaScript</option>
              </select>
            </div>
          </>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100"
          required
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          {isEditing ? 'Update Project' : 'Create Project'}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;