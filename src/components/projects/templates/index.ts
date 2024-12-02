import { Project, ProjectType } from '../../types/project';

export const getProjectTemplate = (type: ProjectType): Partial<Project> => {
  const baseTemplate: Partial<Project> = {
    status: 'planning',
    tasks: [],
    files: [],
    environments: [],
    assignedAgents: [],
    settings: {
      environmentVariables: {},
    },
  };

  switch (type) {
    case 'web':
      return {
        ...baseTemplate,
        framework: 'react',
        language: 'typescript',
        settings: {
          ...baseTemplate.settings,
          buildCommand: 'npm run build',
          startCommand: 'npm run dev',
          testCommand: 'npm test',
          outputDirectory: 'dist',
        },
      };

    case 'game':
      return {
        ...baseTemplate,
        framework: 'unity',
        language: 'c#',
        settings: {
          ...baseTemplate.settings,
          buildCommand: 'dotnet build',
          startCommand: 'dotnet run',
          outputDirectory: 'build',
        },
      };

    case 'book':
      return {
        ...baseTemplate,
        framework: 'markdown',
        language: 'markdown',
        outline: {
          id: '1',
          title: 'Book Outline',
          sections: [],
        },
        settings: {
          ...baseTemplate.settings,
          customSettings: {
            format: 'markdown',
            chapters: [],
            bibliography: [],
          },
        },
      };

    case 'research':
      return {
        ...baseTemplate,
        framework: 'latex',
        language: 'latex',
        research: [],
        settings: {
          ...baseTemplate.settings,
          customSettings: {
            citations: [],
            methodology: '',
            dataCollectionTools: [],
          },
        },
      };

    default:
      return baseTemplate;
  }
};

export const getInitialFiles = (type: ProjectType): Project['files'] => {
  switch (type) {
    case 'web':
      return [
        {
          id: '1',
          name: 'index.html',
          path: '/index.html',
          content: '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <title>Web Project</title>\n  </head>\n  <body>\n    <div id="root"></div>\n  </body>\n</html>',
          lastModified: new Date().toISOString(),
          type: 'html',
        },
        {
          id: '2',
          name: 'styles.css',
          path: '/styles.css',
          content: '/* Add your styles here */',
          lastModified: new Date().toISOString(),
          type: 'css',
        },
      ];

    case 'book':
      return [
        {
          id: '1',
          name: 'README.md',
          path: '/README.md',
          content: '# Book Title\n\n## Overview\n\nAdd your book overview here.',
          lastModified: new Date().toISOString(),
          type: 'markdown',
        },
        {
          id: '2',
          name: 'chapter1.md',
          path: '/chapters/chapter1.md',
          content: '# Chapter 1\n\nBegin your first chapter here.',
          lastModified: new Date().toISOString(),
          type: 'markdown',
        },
      ];

    case 'research':
      return [
        {
          id: '1',
          name: 'paper.tex',
          path: '/paper.tex',
          content: '\\documentclass{article}\n\\begin{document}\n\\title{Research Paper}\n\\author{Your Name}\n\\maketitle\n\n\\section{Introduction}\n\nAdd your introduction here.\n\n\\end{document}',
          lastModified: new Date().toISOString(),
          type: 'latex',
        },
        {
          id: '2',
          name: 'bibliography.bib',
          path: '/bibliography.bib',
          content: '% Add your references here',
          lastModified: new Date().toISOString(),
          type: 'bibtex',
        },
      ];

    default:
      return [];
  }
};