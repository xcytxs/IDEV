import { API_ENDPOINTS, API_TIMEOUT, ERROR_MESSAGES } from '../config/api.config';
import { LLMProvider, Model, ModelStatus } from '../types';
import { APIError, handleAPIError } from './errorHandler';

async function fetchWithTimeout(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const controller = new AbortController();
  const timeoutDuration = options.timeout || API_TIMEOUT;
  const id = setTimeout(() => controller.abort(), timeoutDuration);

  const fetchOptions: RequestInit = {
    ...options,
    signal: controller.signal,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, fetchOptions);
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new APIError(ERROR_MESSAGES.TIMEOUT);
      }
      if (error.message.includes('CORS')) {
        throw new APIError(ERROR_MESSAGES.CORS);
      }
      if (error.message.includes('Failed to fetch')) {
        throw new APIError(ERROR_MESSAGES.NETWORK);
      }
    }
    throw error;
  }
}

export async function fetchModels(provider: LLMProvider): Promise<Model[]> {
  try {
    const url = new URL(API_ENDPOINTS.MODELS, provider.endpoint).toString();
    const response = await fetchWithTimeout(url);
    
    if (!response.ok) {
      throw new APIError(
        `Server error: ${response.status} ${response.statusText}`,
        response.status
      );
    }

    const data = await response.json();
    
    if (!data || !Array.isArray(data.models)) {
      throw new APIError(ERROR_MESSAGES.INVALID_RESPONSE);
    }

    return data.models.map(model => ({
      name: model.name,
      modified_at: model.modified_at,
      size: model.size,
      status: 'ready'
    }));
  } catch (error) {
    throw handleAPIError(error);
  }
}

export async function testProviderConnection(provider: LLMProvider): Promise<boolean> {
  try {
    const url = new URL(API_ENDPOINTS.VERSION, provider.endpoint).toString();
    
    const response = await fetchWithTimeout(url, {
      timeout: 5000,
      method: 'GET'
    });

    if (!response.ok) {
      console.warn('Connection test failed: Server returned', response.status);
      return false;
    }

    const data = await response.json();
    return typeof data.version === 'string' && data.version.length > 0;
  } catch (error) {
    if (error instanceof Error) {
      console.warn('Connection test failed:', error.message);
      return false;
    }
    return false;
  }
}

export async function pullModel(provider: LLMProvider, modelName: string): Promise<void> {
  try {
    const url = new URL(API_ENDPOINTS.PULL, provider.endpoint).toString();
    
    const response = await fetchWithTimeout(url, {
      method: 'POST',
      body: JSON.stringify({ name: modelName }),
    });

    if (!response.ok) {
      throw new APIError(ERROR_MESSAGES.MODEL_PULL_FAILED);
    }
  } catch (error) {
    throw handleAPIError(error);
  }
}

export async function getModelStatus(provider: LLMProvider, modelName: string): Promise<ModelStatus> {
  try {
    const url = new URL(API_ENDPOINTS.MODEL_STATUS, provider.endpoint).toString();
    
    const response = await fetchWithTimeout(url, {
      method: 'POST',
      body: JSON.stringify({ name: modelName }),
    });

    if (!response.ok) {
      throw new APIError(`Failed to get model status: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      name: modelName,
      status: data.status || 'unknown',
      progress: data.progress,
      error: data.error
    };
  } catch (error) {
    throw handleAPIError(error);
  }
}