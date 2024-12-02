import { Project, ProjectFile } from '../types/project';

// In-memory storage for development
const fileStorage = new Map<string, Map<string, string>>();

export class MockProjectService {
  static async initializeProject(project: Project): Promise<boolean> {
    try {
      // Initialize project storage
      fileStorage.set(project.id, new Map());
      
      // Store initial files
      for (const file of project.files) {
        await this.writeFile(project.id, file);
      }

      return true;
    } catch (error) {
      console.error('Error initializing project:', error);
      throw error;
    }
  }

  static async writeFile(projectId: string, file: ProjectFile): Promise<void> {
    const projectFiles = fileStorage.get(projectId);
    if (!projectFiles) {
      throw new Error('Project not initialized');
    }
    projectFiles.set(file.path, file.content);
  }

  static async readFile(projectId: string, filePath: string): Promise<string> {
    const projectFiles = fileStorage.get(projectId);
    if (!projectFiles) {
      throw new Error('Project not initialized');
    }
    const content = projectFiles.get(filePath);
    if (content === undefined) {
      throw new Error('File not found');
    }
    return content;
  }

  static async listFiles(projectId: string): Promise<string[]> {
    const projectFiles = fileStorage.get(projectId);
    if (!projectFiles) {
      throw new Error('Project not initialized');
    }
    return Array.from(projectFiles.keys());
  }

  static async deleteFile(projectId: string, filePath: string): Promise<void> {
    const projectFiles = fileStorage.get(projectId);
    if (!projectFiles) {
      throw new Error('Project not initialized');
    }
    projectFiles.delete(filePath);
  }

  static async createDirectory(projectId: string, path: string): Promise<void> {
    // In our mock implementation, directories are implicit
    // They're created when files are added
    return Promise.resolve();
  }

  static async getProjectStructure(projectId: string): Promise<{[key: string]: string[]}> {
    const projectFiles = fileStorage.get(projectId);
    if (!projectFiles) {
      throw new Error('Project not initialized');
    }

    const structure: {[key: string]: string[]} = {'/': []};
    
    for (const filePath of projectFiles.keys()) {
      const parts = filePath.split('/').filter(Boolean);
      let currentPath = '';
      
      parts.forEach((part, index) => {
        currentPath += `/${part}`;
        if (index === parts.length - 1) {
          const dirPath = currentPath.substring(0, currentPath.lastIndexOf('/')) || '/';
          if (!structure[dirPath]) {
            structure[dirPath] = [];
          }
          structure[dirPath].push(part);
        } else {
          if (!structure[currentPath]) {
            structure[currentPath] = [];
          }
        }
      });
    }

    return structure;
  }

  static async executeCommand(command: string): Promise<{
    output: string;
    error?: string;
  }> {
    // Mock command execution
    return {
      output: `Executed command: ${command}`,
    };
  }

  static async runDevServer(): Promise<void> {
    console.log('Mock dev server started');
  }
}