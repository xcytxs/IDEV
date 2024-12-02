import { ERROR_MESSAGES } from '../config/api.config';

export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export function handleAPIError(error: unknown): APIError {
  if (error instanceof APIError) {
    return error;
  }

  if (error instanceof TypeError) {
    if (error.message.includes('Failed to fetch')) {
      return new APIError(ERROR_MESSAGES.NETWORK);
    }
    if (error.message.includes('CORS')) {
      return new APIError(ERROR_MESSAGES.CORS);
    }
  }

  if (error instanceof Error) {
    return new APIError(error.message);
  }

  return new APIError(ERROR_MESSAGES.SERVER);
}