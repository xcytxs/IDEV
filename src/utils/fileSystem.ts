import { ProjectFile } from '../types/project';
import { WebContainerManager } from './webContainer';

export class FileSystem {
  private workingDirectory: string;

  constructor(workingDirectory: string = '/workspace') {
    this.workingDirectory = workingDirectory;
  }

  async writeFile(file: ProjectFile): Promise<void> {
    try {
      const fullPath = this.getFullPath(file.path);
      await WebContainerManager.writeFile(fullPath, file.content);
      console.log(`File written successfully: ${fullPath}`);
    } catch (error) {
      console.error(`Error writing file: ${file.path}`, error);
      throw error;
    }
  }

  async readFile(path: string): Promise<string> {
    try {
      const fullPath = this.getFullPath(path);
      return await WebContainerManager.readFile(fullPath);
    } catch (error) {
      console.error(`Error reading file: ${path}`, error);
      throw error;
    }
  }

  async createDirectory(path: string): Promise<void> {
    try {
      const fullPath = this.getFullPath(path);
      await WebContainerManager.createWorkspace(fullPath);
    } catch (error) {
      console.error(`Error creating directory: ${path}`, error);
      throw error;
    }
  }

  async listFiles(path: string): Promise<string[]> {
    try {
      const fullPath = this.getFullPath(path);
      return await WebContainerManager.listFiles(fullPath);
    } catch (error) {
      console.error(`Error listing files: ${path}`, error);
      return [];
    }
  }

  async fileExists(path: string): Promise<boolean> {
    const fullPath = this.getFullPath(path);
    return await WebContainerManager.fileExists(fullPath);
  }

  private getFullPath(path: string): string {
    if (path.startsWith('/')) {
      return path;
    }
    return `${this.workingDirectory}/${path}`;
  }
}

export const fileSystem = new FileSystem();