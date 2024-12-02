import React from 'react';
import { AlertCircle, ExternalLink } from 'lucide-react';

interface ErrorDisplayProps {
  message: string;
  onDismiss?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onDismiss }) => {
  const isCorsError = message.toLowerCase().includes('cors');

  return (
    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-start">
      <AlertCircle className="mr-2 mt-1 flex-shrink-0" size={18} />
      <div className="flex-grow">
        <p className="font-semibold">Error</p>
        <p>{message}</p>
        {isCorsError && (
          <p className="mt-2 text-sm">
            To enable CORS, start Ollama with:
            <code className="mx-2 px-2 py-1 bg-red-50 rounded">OLLAMA_ORIGINS=* ollama serve</code>
            <a
              href="https://github.com/ollama/ollama/blob/main/docs/api.md#cors"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-red-700 hover:text-red-800 ml-2"
            >
              Learn more
              <ExternalLink size={14} className="ml-1" />
            </a>
          </p>
        )}
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="ml-2 text-red-700 hover:text-red-800"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default ErrorDisplay;