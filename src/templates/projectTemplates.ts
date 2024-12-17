import { ProjectTemplate, AgentRole, Agent, WorkflowTemplate, ProjectType } from '../types/project';

const createBaseAgent = (role: AgentRole, name: string, description: string, permissions: Agent['permissions']): Agent => ({
  id: `${role}_${Date.now()}`,
  name,
  role,
  description,
  permissions,
  capabilities: [],
  status: 'active'
});

const createBaseWorkflow = (name: string, description: string, steps: WorkflowTemplate['steps']): WorkflowTemplate => ({
  id: `workflow_${Date.now()}`,
  name,
  description,
  steps
});

const baseAgents = {
  orchestrator: createBaseAgent(
    'orchestrator',
    'Project Orchestrator',
    'Coordinates all other agents and ensures project harmony',
    {
      read: ['*'],
      write: ['*'],
      admin: ['*']
    }
  ),
  researcher: createBaseAgent(
    'researcher',
    'Research Specialist',
    'Conducts market research and analyzes trends',
    {
      read: ['research/*', 'docs/*'],
      write: ['research/*'],
      admin: []
    }
  ),
  developer: createBaseAgent(
    'developer',
    'Core Developer',
    'Implements features and maintains code quality',
    {
      read: ['src/*', 'tests/*'],
      write: ['src/*', 'tests/*'],
      admin: ['src/*']
    }
  ),
  tester: createBaseAgent(
    'tester',
    'QA Engineer',
    'Ensures software quality through testing',
    {
      read: ['src/*', 'tests/*'],
      write: ['tests/*'],
      admin: ['tests/*']
    }
  ),
  artist: createBaseAgent(
    'artist',
    'Game Artist',
    'Creates game assets and visuals',
    {
      read: ['assets/*'],
      write: ['assets/*'],
      admin: ['assets/*']
    }
  ),
  writer: createBaseAgent(
    'writer',
    'Technical Writer',
    'Creates and maintains documentation',
    {
      read: ['docs/*'],
      write: ['docs/*'],
      admin: ['docs/*']
    }
  ),
  editor: createBaseAgent(
    'editor',
    'Editor',
    'Reviews and refines content',
    {
      read: ['docs/*'],
      write: ['docs/*'],
      admin: []
    }
  ),
  gameDeveloper: createBaseAgent(
    'gameDeveloper',
    'Game Developer',
    'Develops game mechanics and systems',
    {
      read: ['src/*', 'tests/*'],
      write: ['src/*', 'tests/*'],
      admin: ['src/*']
    }
  ),
  leadDeveloper: createBaseAgent(
    'leadDeveloper',
    'Lead Developer',
    'Manages code architecture and development',
    {
      read: ['src/*', 'tests/*'],
      write: ['src/*', 'tests/*'],
      admin: ['src/*']
    }
  ),
  leadResearcher: createBaseAgent(
    'leadResearcher',
    'Lead Researcher',
    'Conducts research and analysis',
    {
      read: ['research/*', 'docs/*'],
      write: ['research/*'],
      admin: []
    }
  ),
  videoEditor: createBaseAgent(
    'videoEditor',
    'Video Editor',
    'Edits and processes videos',
    {
      read: ['assets/*'],
      write: ['assets/*'],
      admin: ['assets/*']
    }
  ),
  imageGenerator: createBaseAgent(
    'imageGenerator',
    'Image Generator',
    'Creates and edits images',
    {
      read: ['assets/*'],
      write: ['assets/*'],
      admin: ['assets/*']
    }
  )
};

const baseWorkflows = {
  featureDevelopment: createBaseWorkflow(
    'Feature Development',
    'Complete workflow for new feature development',
    [
      {
        id: 'research',
        name: 'Market Research',
        description: 'Research market needs and competitor analysis',
        requiredRole: 'researcher',
        dependencies: [],
        artifacts: {
          input: ['requirements.md'],
          output: ['research-report.md']
        }
      },
      {
        id: 'development',
        name: 'Implementation',
        description: 'Develop the feature',
        requiredRole: 'developer',
        dependencies: ['research'],
        artifacts: {
          input: ['research-report.md'],
          output: ['src/**/*']
        }
      },
      {
        id: 'testing',
        name: 'Quality Assurance',
        description: 'Test the implemented feature',
        requiredRole: 'tester',
        dependencies: ['development'],
        artifacts: {
          input: ['src/**/*'],
          output: ['tests/**/*', 'test-report.md']
        }
      }
    ]
  ),
  gameDevelopment: createBaseWorkflow(
    'Game Development',
    'Complete workflow for game development',
    [
      {
        id: 'gameDesign',
        name: 'Game Design',
        description: 'Design the game mechanics and systems',
        requiredRole: 'gameDeveloper',
        dependencies: [],
        artifacts: {
          input: ['game-design.md'],
          output: ['src/**/*']
        }
      },
      {
        id: 'gameArt',
        name: 'Game Art',
        description: 'Create game assets and visuals',
        requiredRole: 'artist',
        dependencies: ['gameDesign'],
        artifacts: {
          input: ['src/**/*'],
          output: ['assets/**/*']
        }
      },
      {
        id: 'gameTesting',
        name: 'Game Testing',
        description: 'Test the game',
        requiredRole: 'tester',
        dependencies: ['gameArt'],
        artifacts: {
          input: ['src/**/*', 'assets/**/*'],
          output: ['tests/**/*', 'test-report.md']
        }
      }
    ]
  ),
  bookWriting: createBaseWorkflow(
    'Book Writing',
    'Complete workflow for book writing',
    [
      {
        id: 'outline',
        name: 'Outline',
        description: 'Create an outline of the book',
        requiredRole: 'writer',
        dependencies: [],
        artifacts: {
          input: ['outline.md'],
          output: ['outline.md']
        }
      },
      {
        id: 'writing',
        name: 'Writing',
        description: 'Write the book',
        requiredRole: 'writer',
        dependencies: ['outline'],
        artifacts: {
          input: ['outline.md'],
          output: ['book.md']
        }
      },
      {
        id: 'editing',
        name: 'Editing',
        description: 'Edit the book',
        requiredRole: 'editor',
        dependencies: ['writing'],
        artifacts: {
          input: ['book.md'],
          output: ['edited-book.md']
        }
      }
    ]
  ),
  videoProduction: createBaseWorkflow(
    'Video Production',
    'Complete workflow for video production',
    [
      {
        id: 'scripting',
        name: 'Scripting',
        description: 'Write the script for the video',
        requiredRole: 'writer',
        dependencies: [],
        artifacts: {
          input: ['script.md'],
          output: ['script.md']
        }
      },
      {
        id: 'filming',
        name: 'Filming',
        description: 'Film the video',
        requiredRole: 'videoEditor',
        dependencies: ['scripting'],
        artifacts: {
          input: ['script.md'],
          output: ['video.mp4']
        }
      },
      {
        id: 'editing',
        name: 'Editing',
        description: 'Edit the video',
        requiredRole: 'videoEditor',
        dependencies: ['filming'],
        artifacts: {
          input: ['video.mp4'],
          output: ['edited-video.mp4']
        }
      }
    ]
  ),
  imageCreation: createBaseWorkflow(
    'Image Creation',
    'Complete workflow for image creation',
    [
      {
        id: 'concept',
        name: 'Concept',
        description: 'Create a concept for the image',
        requiredRole: 'imageGenerator',
        dependencies: [],
        artifacts: {
          input: ['concept.md'],
          output: ['concept.md']
        }
      },
      {
        id: 'creation',
        name: 'Creation',
        description: 'Create the image',
        requiredRole: 'imageGenerator',
        dependencies: ['concept'],
        artifacts: {
          input: ['concept.md'],
          output: ['image.png']
        }
      },
      {
        id: 'editing',
        name: 'Editing',
        description: 'Edit the image',
        requiredRole: 'imageGenerator',
        dependencies: ['creation'],
        artifacts: {
          input: ['image.png'],
          output: ['edited-image.png']
        }
      }
    ]
  )
};

const templates: Record<ProjectType, ProjectTemplate> = {
  code: {
    type: 'code',
    category: 'development',
    framework: 'react',
    language: 'typescript',
    agents: {
      required: [
        baseAgents.leadDeveloper,
        baseAgents.developer,
        baseAgents.tester
      ],
      optional: [
        baseAgents.researcher
      ]
    },
    workflowTemplates: [
      baseWorkflows.featureDevelopment
    ],
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
    agents: {
      required: [
        baseAgents.writer,
        baseAgents.editor
      ],
      optional: []
    },
    workflowTemplates: [
      baseWorkflows.bookWriting
    ],
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
    agents: {
      required: [
        baseAgents.imageGenerator
      ],
      optional: []
    },
    workflowTemplates: [
      baseWorkflows.imageCreation
    ],
    files: [],
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
    agents: {
      required: [
        baseAgents.videoEditor
      ],
      optional: []
    },
    workflowTemplates: [
      baseWorkflows.videoProduction
    ],
    files: [],
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
    agents: {
      required: [
        baseAgents.gameDeveloper,
        baseAgents.artist
      ],
      optional: []
    },
    workflowTemplates: [
      baseWorkflows.gameDevelopment
    ],
    files: [],
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
    agents: {
      required: [
        baseAgents.leadResearcher,
        baseAgents.writer
      ],
      optional: []
    },
    workflowTemplates: [],
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
    agents: {
      required: [
        baseAgents.writer
      ],
      optional: []
    },
    workflowTemplates: [],
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
): Omit<ProjectTemplate, 'id'> => {
  const template = getProjectTemplate(type);
  
  return {
    ...template,
    name,
    description,
    agents: {
      ...template.agents,
      required: template.agents.required.map(agent => ({
        ...agent,
        id: `${agent.role}_${Date.now()}`
      })),
      optional: template.agents.optional.map(agent => ({
        ...agent,
        id: `${agent.role}_${Date.now()}`
      }))
    }
  };
};