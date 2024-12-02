import React from 'react';
import { Edit, Trash2, RefreshCw } from 'lucide-react';
import { LLMProvider, Model } from '../types';

interface ProviderCardProps {
  provider: LLMProvider;
  connectionStatus: string;
  onDelete: () => void;
  onEdit: () => void;
  onTest: () => void;
  onFetchModels: () => void;
  isLoadingModels: boolean;
  models: Model[];
}

const ProviderCard: React.FC<ProviderCardProps> = ({
  provider,
  connectionStatus,
  onDelete,
  onEdit,
  onTest,
  onFetchModels,
  isLoadingModels,
  models
}) => {
  return (
    <li className="mb-4 p-4 border rounded hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-semibold">{provider.name}</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={onTest}
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-colors"
          >
            Test Connection
          </button>
          <button onClick={onEdit} className="text-blue-500 hover:text-blue-600">
            <Edit size={18} />
          </button>
          <button onClick={onDelete} className="text-red-500 hover:text-red-600">
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      <p className="mb-2">Endpoint: {provider.endpoint}</p>
      <p className="mb-2">Connection Status: 
        <span className={`ml-2 ${
          connectionStatus === 'Connected' ? 'text-green-500' : 
          connectionStatus === 'Testing...' ? 'text-yellow-500' : 'text-red-500'
        }`}>
          {connectionStatus}
        </span>
      </p>
      <button
        onClick={onFetchModels}
        className="mt-2 bg-blue-500 text-white p-2 rounded flex items-center hover:bg-blue-600 transition-colors"
        disabled={isLoadingModels}
      >
        <RefreshCw size={18} className={`mr-2 ${isLoadingModels ? 'animate-spin' : ''}`} />
        {isLoadingModels ? 'Fetching Models...' : 'Fetch Available Models'}
      </button>
      {models.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Available Models:</h4>
          <ul className="list-disc pl-5">
            {models.map(model => (
              <li key={model.name} className="text-gray-700">
                {model.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
};

export default ProviderCard;