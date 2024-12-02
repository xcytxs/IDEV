export interface LLMProvider {
  name: string;
  endpoint: string;
  status?: 'active' | 'inactive';
  models?: Model[];
}

export interface Model {
  name: string;
  modified_at?: string;
  size?: number;
  status?: 'ready' | 'downloading' | 'error';
}

export interface ConnectionStatus {
  [key: string]: string;
}

export interface ModelStatus {
  name: string;
  status: string;
  progress?: number;
  error?: string;
}