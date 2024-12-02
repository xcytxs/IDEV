import { BaseAgent } from '../agent';

export interface DevelopmentCapabilities {
  canAccessCodebase: boolean;
  canDeployCode: boolean;
  canReviewCode: boolean;
  canManageDependencies: boolean;
}

export interface DevelopmentAgent extends BaseAgent {
  type: 'development';
  capabilities: DevelopmentCapabilities;
  specializations: string[];
  activeProjects: string[];
  codeMetrics: {
    linesOfCode: number;
    codeQuality: number;
    bugCount: number;
  };
}