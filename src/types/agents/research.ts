import { BaseAgent } from '../agent';

export interface ResearchCapabilities {
  canAccessMarketData: boolean;
  canCreateReports: boolean;
  canAnalyzeCompetitors: boolean;
  canProposeSolutions: boolean;
}

export interface ResearchAgent extends BaseAgent {
  type: 'research';
  capabilities: ResearchCapabilities;
  researchAreas: string[];
  publications: string[];
  insights: {
    id: string;
    title: string;
    content: string;
    date: string;
  }[];
}