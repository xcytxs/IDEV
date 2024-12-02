import { BaseAgent } from '../agent';

export interface TestingCapabilities {
  canCreateTests: boolean;
  canRunTests: boolean;
  canReportBugs: boolean;
  canAccessTestEnvironments: boolean;
}

export interface TestingAgent extends BaseAgent {
  type: 'testing';
  capabilities: TestingCapabilities;
  testSuites: string[];
  testMetrics: {
    coverage: number;
    passRate: number;
    bugsSeverity: Record<string, number>;
  };
}