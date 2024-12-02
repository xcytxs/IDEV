import React, { useState } from 'react';
import { LLMProvider, Model } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import { fetchModels, testProviderConnection } from '../utils/api';
import ProviderForm from './ProviderForm';
import ProviderCard from './ProviderCard';
import ErrorDisplay from './ErrorDisplay';
import { APIError } from '../utils/errorHandler';

const LLMProviderManagement: React.FC = () => {
  const [providers, setProviders] = useLocalStorage<LLMProvider[]>('llmProviders', []);
  const [newProvider, setNewProvider] = useState<Partial<LLMProvider>>({ name: '', endpoint: '' });
  const [editingProvider, setEditingProvider] = useState<string | null>(null);
  const [availableModels, setAvailableModels] = useState<{ [key: string]: Model[] }>({});
  const [isLoadingModels, setIsLoadingModels] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<{ [key: string]: string }>({});

  const validateEndpoint = (endpoint: string): string => {
    try {
      const url = new URL(endpoint);
      return url.toString().replace(/\/$/, ''); // Remove trailing slash if present
    } catch {
      throw new Error('Invalid URL format. Please enter a valid URL including protocol (e.g., http:// or https://)');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProvider(prev => ({ ...prev, [name]: value }));
    if (name === 'endpoint') {
      setError(null); // Clear any previous errors
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validatedEndpoint = validateEndpoint(newProvider.endpoint || '');
      const provider = {
        ...newProvider,
        endpoint: validatedEndpoint
      } as LLMProvider;

      if (editingProvider) {
        setProviders(prev => prev.map(p => 
          p.name === editingProvider ? provider : p
        ));
        setEditingProvider(null);
      } else {
        setProviders(prev => [...prev, provider]);
      }
      setNewProvider({ name: '', endpoint: '' });
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Invalid provider configuration');
    }
  };

  const handleEdit = (provider: LLMProvider) => {
    setNewProvider(provider);
    setEditingProvider(provider.name);
    setError(null);
  };

  const handleDelete = (name: string) => {
    setProviders(prev => prev.filter(p => p.name !== name));
    setAvailableModels(prev => {
      const newModels = { ...prev };
      delete newModels[name];
      return newModels;
    });
    setError(null);
  };

  const handleFetchModels = async (provider: LLMProvider) => {
    setIsLoadingModels(prev => ({ ...prev, [provider.name]: true }));
    setError(null);
    try {
      const models = await fetchModels(provider);
      setAvailableModels(prev => ({ ...prev, [provider.name]: models }));
    } catch (error) {
      const apiError = error as APIError;
      setError(apiError.message);
    } finally {
      setIsLoadingModels(prev => ({ ...prev, [provider.name]: false }));
    }
  };

  const handleTestConnection = async (provider: LLMProvider) => {
    setConnectionStatus(prev => ({ ...prev, [provider.name]: 'Testing...' }));
    setError(null);
    try {
      const isConnected = await testProviderConnection(provider);
      setConnectionStatus(prev => ({
        ...prev,
        [provider.name]: isConnected ? 'Connected' : 'Connection failed'
      }));
      if (!isConnected) {
        setError('Could not connect to the server. Please check the endpoint URL and ensure the server is running.');
      }
    } catch (error) {
      setConnectionStatus(prev => ({
        ...prev,
        [provider.name]: 'Connection failed'
      }));
      setError(error instanceof Error ? error.message : 'Connection test failed');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-4">LLM Provider Management</h1>
      
      <ProviderForm
        provider={newProvider}
        onSubmit={handleSubmit}
        onChange={handleInputChange}
        isEditing={!!editingProvider}
      />

      {error && (
        <ErrorDisplay
          message={error}
          onDismiss={() => setError(null)}
        />
      )}

      <ul>
        {providers.map(provider => (
          <ProviderCard
            key={provider.name}
            provider={provider}
            connectionStatus={connectionStatus[provider.name] || 'Not tested'}
            onDelete={() => handleDelete(provider.name)}
            onEdit={() => handleEdit(provider)}
            onTest={() => handleTestConnection(provider)}
            onFetchModels={() => handleFetchModels(provider)}
            isLoadingModels={!!isLoadingModels[provider.name]}
            models={availableModels[provider.name] || []}
          />
        ))}
      </ul>
    </div>
  );
};

export default LLMProviderManagement;