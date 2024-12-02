import React from 'react';
import { Model } from '../types';
import { Download, CheckCircle, AlertCircle, Loader } from 'lucide-react';

interface ModelListProps {
  models: Model[];
  onPullModel: (modelName: string) => void;
  isModelPulling: { [key: string]: boolean };
}

const ModelList: React.FC<ModelListProps> = ({ models, onPullModel, isModelPulling }) => {
  const formatSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    const gb = bytes / (1024 * 1024 * 1024);
    return `${gb.toFixed(2)} GB`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="mt-4">
      <h4 className="font-semibold mb-2">Available Models:</h4>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {models.map(model => (
          <div key={model.name} className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <h5 className="font-medium text-gray-900">{model.name}</h5>
              {model.status === 'ready' ? (
                <CheckCircle className="text-green-500" size={20} />
              ) : model.status === 'error' ? (
                <AlertCircle className="text-red-500" size={20} />
              ) : null}
            </div>
            <div className="text-sm text-gray-600">
              <p>Size: {formatSize(model.size)}</p>
              <p>Modified: {formatDate(model.modified_at)}</p>
            </div>
            <button
              onClick={() => onPullModel(model.name)}
              disabled={isModelPulling[model.name]}
              className={`mt-3 flex items-center justify-center w-full p-2 rounded ${
                isModelPulling[model.name]
                  ? 'bg-gray-100 text-gray-500'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              } transition-colors`}
            >
              {isModelPulling[model.name] ? (
                <>
                  <Loader className="animate-spin mr-2" size={16} />
                  Pulling...
                </>
              ) : (
                <>
                  <Download className="mr-2" size={16} />
                  Pull Model
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModelList;