import { Project, ProjectFile } from '../types/project';
import WebContainerManager from '../utils/webContainer';

export class ProjectService {
  private static WORKSPACE_ROOT = '/workspace';

  static async initializeProject(project: Project): Promise<boolean> {
    try {
      const projectPath = `${this.WORKSPACE_ROOT}/${project.id}`;
      await WebContainerManager.createWorkspace(projectPath);

      if (this.isNodeProject(project)) {
        await this.initializeNodeProject(project);
      }

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
    const filePath = this.getFilePath(projectId, file.path);
    await WebContainerManager.writeFile(filePath, file.content);
  }

  static async readFile(projectId: string, filePath: string): Promise<string> {
    const fullPath = this.getFilePath(projectId, filePath);
    return await WebContainerManager.readFile(fullPath);
  }

  private static isNodeProject(project: Project): boolean {
    return ['web', 'api', 'fullstack'].includes(project.type);
  }

  private static async initializeNodeProject(project: Project): Promise<void> {
    const packageJson = {
      name: project.name.toLowerCase().replace(/\s+/g, '-'),
      version: '0.1.0',
      private: true,
      type: 'module',
      scripts: {
        dev: project.settings.startCommand || 'vite',
        build: project.settings.buildCommand || 'vite build',
        preview: 'vite preview',
      },
    };

    await WebContainerManager.writeFile(
      `${this.WORKSPACE_ROOT}/${project.id}/package.json`,
      JSON.stringify(packageJson, null, 2)
    );
  }

  private static getFilePath(projectId: string, filePath: string): string {
    return `${this.WORKSPACE_ROOT}/${projectId}${filePath}`;
  }
}