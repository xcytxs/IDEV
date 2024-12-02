import { useState, useCallback } from 'react';
import { Agent } from '../types/agent';
import { Project, ProjectFile } from '../types/project';
import { fileSystem } from '../utils/fileSystem';
import { useChatStore } from '../store/chatStore';

export function useAgent(agent: Agent, project: Project) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFiles, setLastFiles] = useState<ProjectFile[]>([]);
  const { addMessage } = useChatStore();

  const createFile = async (path: string, content: string): Promise<ProjectFile> => {
    const file: ProjectFile = {
      id: `file-${Date.now()}-${Math.random().toString(36).substring(2)}`,
      name: path.split('/').pop() || '',
      path,
      content,
      type: path.split('.').pop() || 'txt',
      lastModified: new Date().toISOString()
    };

    try {
      await fileSystem.writeFile(file);
      return file;
    } catch (err) {
      console.error('Error creating file:', err);
      throw err;
    }
  };

  const sendMessage = useCallback(async (message: string) => {
    if (!agent.capabilities) {
      return "I don't have the necessary capabilities to help with that.";
    }

    setIsProcessing(true);
    setError(null);
    const createdFiles: ProjectFile[] = [];

    try {
      if (message.toLowerCase().includes('create')) {
        if (message.toLowerCase().includes('readme')) {
          const readmeContent = `# ${project.name}\n\n## Description\n\n${project.description || 'Add project description here.'}\n\n## Features\n\n- Feature 1\n- Feature 2\n\n## Getting Started\n\n### Prerequisites\n\n### Installation\n\n## Usage\n\n## Contributing\n\n## License\n`;
          const readmeFile = await createFile('/README.md', readmeContent);
          createdFiles.push(readmeFile);
        }

        if (message.toLowerCase().includes('tsconfig')) {
          const tsconfigContent = JSON.stringify({
            compilerOptions: {
              target: "ES2020",
              useDefineForClassFields: true,
              lib: ["ES2020", "DOM", "DOM.Iterable"],
              module: "ESNext",
              skipLibCheck: true,
              moduleResolution: "bundler",
              allowImportingTsExtensions: true,
              resolveJsonModule: true,
              isolatedModules: true,
              noEmit: true,
              jsx: "react-jsx",
              strict: true,
              noUnusedLocals: true,
              noUnusedParameters: true,
              noFallthroughCasesInSwitch: true
            },
            include: ["src"],
            references: [{ path: "./tsconfig.node.json" }]
          }, null, 2);
          const tsconfigFile = await createFile('/tsconfig.json', tsconfigContent);
          createdFiles.push(tsconfigFile);
        }

        setLastFiles(createdFiles);
        return `I've created the requested files:\n${createdFiles.map(f => `- ${f.path}`).join('\n')}\n\nWould you like me to create any other files or make modifications?`;
      }

      // Handle file modification requests
      if (message.toLowerCase().includes('modify') || message.toLowerCase().includes('update')) {
        const fileMatch = message.match(/(?:modify|update)\s+([\/\w\-\.]+)/i);
        if (fileMatch) {
          const [, filePath] = fileMatch;
          const file = project.files.find(f => f.path === filePath);
          if (file) {
            setLastFiles([file]);
            return `I've updated the file ${filePath}. Would you like to make any other changes?`;
          }
        }
      }

      setLastFiles([]);
      return `I understand you want to ${message}. How can I help you with that?`;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process message';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [agent.capabilities, project.name, project.description, project.files]);

  return {
    sendMessage,
    isProcessing,
    error,
    lastFiles,
    clearError: () => setError(null)
  };
}