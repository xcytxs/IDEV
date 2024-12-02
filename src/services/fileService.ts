import { ProjectFile } from '../types/project';
import WebContainerManager from '../utils/webContainer';

export class FileService {
  static async writeFile(path: string, content: string): Promise<void> {
    try {
      await WebContainerManager.writeFile(path, content);
    } catch (error) {
      console.error(`Error writing file: ${path}`, error);
      throw error;
    }
  }

  static async readFile(path: string): Promise<string> {
    try {
      return await WebContainerManager.readFile(path);
    } catch (error) {
      console.error(`Error reading file: ${path}`, error);
      throw error;
    }
  }

  static async createDirectory(path: string): Promise<void> {
    try {
      await WebContainerManager.createWorkspace(path);
    } catch (error) {
      console.error(`Error creating directory: ${path}`, error);
      throw error;
    }
  }

  static async listFiles(path: string): Promise<string[]> {
    try {
      return await WebContainerManager.listFiles(path);
    } catch (error) {
      console.error(`Error listing files: ${path}`, error);
      throw error;
    }
  }
}