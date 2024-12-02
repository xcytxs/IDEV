import React from 'react';
import { LLMProvider } from '../types';

interface ProviderFormProps {
  provider: Partial<LLMProvider>;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isEditing: boolean;
}

const ProviderForm: React.FC<ProviderFormProps> = ({
  provider,
  onSubmit,
  onChange,
  isEditing
}) => {
  return (
    <form onSubmit={onSubmit} className="mb-6">
      <input
        type="text"
        name="name"
        value={provider.name || ''}
        onChange={onChange}
        placeholder="Provider Name"
        className="mr-2 p-2 border rounded"
        required
      />
      <input
        type="text"
        name="endpoint"
        value={provider.endpoint || ''}
        onChange={onChange}
        placeholder="Endpoint URL"
        className="mr-2 p-2 border rounded"
        required
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors">
        {isEditing ? 'Update Provider' : 'Add Provider'}
      </button>
    </form>
  );
};

export default ProviderForm;