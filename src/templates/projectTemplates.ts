import { ProjectTemplate, ProjectType } from '../types/project';

const templates: Record<ProjectType, ProjectTemplate> = {
  code: {
    type: 'code',
    category: 'development',
    framework: 'react',
    language: 'typescript',
    files: [
      {
        id: 'index',
        name: 'index.html',
        path: '/index.html',
        content: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Project</title>\n</head>\n<body>\n  <div id="root"></div>\n</body>\n</html>',
        type: 'html',
        lastModified: new Date().toISOString()
      }
    ],
    assets: {
      images: [],
      videos: [],
      audio: [],
      models: [],
      documents: []
    },
    requiredAgents: [
      {
        type: 'developer',
        role: 'Lead Developer',
        description: 'Manages code architecture and development'
      }
    ],
    settings: {
      buildCommand: 'npm run build',
      startCommand: 'npm run dev',
      testCommand: 'npm test',
      outputDirectory: 'dist'
    }
  },
  book: {
    type: 'book',
    category: 'content',
    framework: 'markdown',
    language: 'markdown',
    files: [
      {
        id: 'outline',
        name: 'outline.md',
        path: '/outline.md',
        content: '# Book Outline\n\n## Chapter 1\n\n## Chapter 2\n',
        type: 'markdown',
        lastModified: new Date().toISOString()
      }
    ],
    assets: {
      images: [],
      videos: [],
      audio: [],
      models: [],
      documents: []
    },
    requiredAgents: [
      {
        type: 'writer',
        role: 'Author',
        description: 'Creates and manages book content'
      },
      {
        type: 'editor',
        role: 'Editor',
        description: 'Reviews and refines content'
      }
    ],
    settings: {
      customSettings: {
        format: 'markdown',
        exportFormats: ['pdf', 'epub', 'mobi']
      }
    }
  },
  image: {
    type: 'image',
    category: 'creative',
    framework: 'none',
    language: 'none',
    files: [],
    assets: {
      images: [],
      videos: [],
      audio: [],
      models: [],
      documents: []
    },
    requiredAgents: [
      {
        type: 'artist',
        role: 'Image Generator',
        description: 'Creates and edits images'
      }
    ],
    settings: {
      customSettings: {
        defaultImageFormat: 'png',
        maxImageSize: 4096,
        supportedFormats: ['png', 'jpg', 'webp']
      }
    }
  },
  video: {
    type: 'video',
    category: 'creative',
    framework: 'none',
    language: 'none',
    files: [],
    assets: {
      images: [],
      videos: [],
      audio: [],
      models: [],
      documents: []
    },
    requiredAgents: [
      {
        type: 'editor',
        role: 'Video Editor',
        description: 'Edits and processes videos'
      }
    ],
    settings: {
      customSettings: {
        defaultVideoFormat: 'mp4',
        maxVideoLength: 3600,
        supportedFormats: ['mp4', 'webm']
      }
    }
  },
  game: {
    type: 'game',
    category: 'development',
    framework: 'unity',
    language: 'csharp',
    files: [],
    assets: {
      images: [],
      videos: [],
      audio: [],
      models: [],
      documents: []
    },
    requiredAgents: [
      {
        type: 'developer',
        role: 'Game Developer',
        description: 'Develops game mechanics and systems'
      },
      {
        type: 'artist',
        role: 'Game Artist',
        description: 'Creates game assets and visuals'
      }
    ],
    settings: {
      buildCommand: 'dotnet build',
      startCommand: 'dotnet run',
      outputDirectory: 'build'
    }
  },
  research: {
    type: 'research',
    category: 'research',
    framework: 'latex',
    language: 'latex',
    files: [
      {
        id: 'main',
        name: 'main.tex',
        path: '/main.tex',
        content: '\\documentclass{article}\n\\begin{document}\n\\title{Research Paper}\n\\author{}\n\\maketitle\n\\end{document}',
        type: 'latex',
        lastModified: new Date().toISOString()
      }
    ],
    assets: {
      images: [],
      videos: [],
      audio: [],
      models: [],
      documents: []
    },
    requiredAgents: [
      {
        type: 'researcher',
        role: 'Lead Researcher',
        description: 'Conducts research and analysis'
      },
      {
        type: 'writer',
        role: 'Technical Writer',
        description: 'Documents research findings'
      }
    ],
    settings: {
      customSettings: {
        citationStyle: 'apa',
        bibliography: true
      }
    }
  },
  documentation: {
    type: 'documentation',
    category: 'content',
    framework: 'markdown',
    language: 'markdown',
    files: [
      {
        id: 'index',
        name: 'index.md',
        path: '/index.md',
        content: '# Documentation\n\n## Overview\n\n## Getting Started\n',
        type: 'markdown',
        lastModified: new Date().toISOString()
      }
    ],
    assets: {
      images: [],
      videos: [],
      audio: [],
      models: [],
      documents: []
    },
    requiredAgents: [
      {
        type: 'writer',
        role: 'Technical Writer',
        description: 'Creates and maintains documentation'
      }
    ],
    settings: {
      customSettings: {
        format: 'markdown',
        exportFormats: ['html', 'pdf']
      }
    }
  }
};

export const getProjectTemplate = (type: ProjectType): ProjectTemplate => {
  const template = templates[type];
  if (!template) {
    throw new Error(`No template found for project type: ${type}`);
  }
  return template;
};

export const createProjectFromTemplate = (
  name: string,
  description: string,
  type: ProjectType
): Omit<Project, 'id'> => {
  const template = getProjectTemplate(type);
  const now = new Date().toISOString();

  return {
    name,
    description,
    type: template.type,
    category: template.category,
    framework: template.framework,
    language: template.language,
    status: 'planning',
    createdAt: now,
    updatedAt: now,
    tasks: [],
    files: template.files,
    assets: template.assets,
    environments: [],
    assignedAgents: [],
    settings: template.settings
  };
};