export const API_TIMEOUT = 30000; // 30 seconds for model operations

export const API_ENDPOINTS = {
  MODELS: 'api/tags',
  VERSION: 'api/version',
  PULL: 'api/pull',
  MODEL_STATUS: 'api/show',
} as const;

export const ERROR_MESSAGES = {
  NETWORK: 'Network error. Please check your connection and ensure CORS is enabled on the Ollama server.',
  TIMEOUT: 'Request timed out. The server took too long to respond.',
  SERVER: 'Server error occurred while processing the request.',
  INVALID_RESPONSE: 'Invalid response received from server.',
  CORS: 'CORS error. Please ensure CORS is enabled on the Ollama server.',
  INVALID_URL: 'Invalid URL format. Please ensure the endpoint URL is correct.',
  MODEL_PULL_FAILED: 'Failed to pull the model. Please try again.',
} as const;