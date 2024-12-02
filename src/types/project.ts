import { Agent } from './agent';

export type ProjectType = 
  | 'code' 
  | 'book'
  | 'image'
  | 'video'
  | 'game'
  | 'research'
  | 'documentation';

export type ProjectCategory =
  | 'development'
  | 'creative'
  | 'research'
  | 'content';

export type Framework = 
  | 'react' 
  | 'vue' 
  | 'angular' 
  | 'unity'
  | 'unreal'
  | 'godot'
  | 'latex'
  | 'markdown'
  | 'none';

export type Language = 
  | 'typescript' 
  | 'javascript'
  | 'python'
  | 'csharp'
  | 'cpp'
  | 'markdown'
  | 'latex'
  | 'none';

export interface ProjectFile {
  id: string;
  name: string;
  path: string;
  content: string;
  lastModified: string;
  type: string;
  metadata?: {
    mimeType?: string;
    size?: number;
    dimensions?: { width: number; height: number };
    duration?: number;
    thumbnail?: string;
  };
}

export interface ProjectTask {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  assignedAgentId?: string;
  createdAt: string;
  updatedAt: string;
  priority: 'low' | 'medium' | 'high';
  dependencies?: string[];
}

export interface ProjectEnvironment {
  id: string;
  name: string;
  type: 'development' | 'staging' | 'production';
  url?: string;
  variables: Record<string, string>;
}

export interface ProjectResearch {
  id: string;
  title: string;
  content: string;
  sources: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectOutline {
  id: string;
  title: string;
  sections: {
    id: string;
    title: string;
    content?: string;
    subsections?: Array<{
      id: string;
      title: string;
      content?: string;
    }>;
  }[];
}

export interface ProjectAssets {
  images: ProjectFile[];
  videos: ProjectFile[];
  audio: ProjectFile[];
  models: ProjectFile[];
  documents: ProjectFile[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  type: ProjectType;
  category: ProjectCategory;
  framework: Framework;
  language: Language;
  status: 'planning' | 'in-progress' | 'review' | 'completed' | 'archived';
  repository?: string;
  createdAt: string;
  updatedAt: string;
  tasks: ProjectTask[];
  files: ProjectFile[];
  assets: ProjectAssets;
  environments: ProjectEnvironment[];
  assignedAgents: Agent[];
  research?: ProjectResearch[];
  outline?: ProjectOutline;
  orchestratorId?: string;
  settings: {
    buildCommand?: string;
    startCommand?: string;
    testCommand?: string;
    outputDirectory?: string;
    environmentVariables: Record<string, string>;
    customSettings?: Record<string, any>;
  };
}

export interface ProjectTemplate {
  type: ProjectType;
  category: ProjectCategory;
  framework: Framework;
  language: Language;
  files: ProjectFile[];
  assets: ProjectAssets;
  requiredAgents: {
    type: string;
    role: string;
    description: string;
  }[];
  settings: Partial<Project['settings']>;
}