import WebContainerManager from './webContainer';
import { Project, ProjectFile } from '../types/project';
import { saveToLocalStorage, loadFromLocalStorage } from './storage';

export class ProjectManager {
  private static STORAGE_KEY = 'projects';
  private static WORKSPACE_ROOT = '/workspace';

  static async initializeProject(project: Project): Promise<boolean> {
    try {
      // Create project workspace
      const projectPath = `${this.WORKSPACE_ROOT}/${project.id}`;
      await WebContainerManager.createWorkspace(projectPath);

      // Create package.json if it's a Node.js project
      if (this.isNodeProject(project)) {
        await this.initializeNodeProject(project);
      }

      // Initialize project files
      for (const file of project.files) {
        await this.writeFile(project.id, file);
      }

      // Save project metadata
      await this.saveProject(project);

      return true;
    } catch (error) {
      console.error('Error initializing project:', error);
      throw error;
    }
  }

  static async writeFile(projectId: string, file: ProjectFile): Promise<void> {
    const filePath = this.getFilePath(projectId, file.path);
    await WebContainerManager.writeFile(filePath, file.content);
    
    // Update file in project
    const project = await this.getProject(projectId);
    if (project) {
      const fileIndex = project.files.findIndex(f => f.id === file.id);
      if (fileIndex !== -1) {
        project.files[fileIndex] = file;
      } else {
        project.files.push(file);
      }
      await this.saveProject(project);
    }
  }

  static async readFile(projectId: string, filePath: string): Promise<string> {
    const fullPath = this.getFilePath(projectId, filePath);
    return await WebContainerManager.readFile(fullPath);
  }

  static async executeCommand(
    projectId: string,
    command: string,
    options: { env?: Record<string, string> } = {}
  ): Promise<{
    output: string;
    error?: string;
  }> {
    const projectPath = `${this.WORKSPACE_ROOT}/${projectId}`;
    return await WebContainerManager.executeCommand('sh', ['-c', command], {
      cwd: projectPath,
      env: options.env,
    });
  }

  static async runDevServer(projectId: string): Promise<void> {
    const project = await this.getProject(projectId);
    if (!project) throw new Error('Project not found');

    const command = project.settings.startCommand || 'npm run dev';
    await WebContainerManager.runDevServer(
      `${this.WORKSPACE_ROOT}/${projectId}`,
      command
    );
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

    // Install project dependencies
    if (project.settings.dependencies) {
      await WebContainerManager.installDependencies(
        `${this.WORKSPACE_ROOT}/${project.id}`,
        Object.entries(project.settings.dependencies).map(
          ([name, version]) => `${name}@${version}`
        )
      );
    }
  }

  private static isNodeProject(project: Project): boolean {
    return ['web', 'api', 'fullstack'].includes(project.type);
  }

  private static getFilePath(projectId: string, filePath: string): string {
    return `${this.WORKSPACE_ROOT}/${projectId}${filePath}`;
  }

  static async saveProject(project: Project): Promise<void> {
    try {
      // Load existing projects
      const projects = await loadFromLocalStorage<Project[]>(this.STORAGE_KEY, []);
      const index = projects.findIndex(p => p.id === project.id);
      
      // Update or add project
      if (index !== -1) {
        projects[index] = { ...projects[index], ...project };
      } else {
        projects.push(project);
      }

      // Save to localStorage
      await saveToLocalStorage(this.STORAGE_KEY, projects);
      
      // Create workspace directory if it doesn't exist
      const workspacePath = `${this.WORKSPACE_ROOT}/${project.id}`;
      const exists = await WebContainerManager.fileExists(workspacePath);
      if (!exists) {
        await WebContainerManager.createWorkspace(workspacePath);
      }
    } catch (error) {
      console.error('Failed to save project:', error);
      throw new Error('Failed to save project');
    }
  }

  static async deleteProject(projectId: string): Promise<void> {
    try {
      // Remove from localStorage
      const projects = await loadFromLocalStorage<Project[]>(this.STORAGE_KEY, []);
      const filteredProjects = projects.filter(p => p.id !== projectId);
      await saveToLocalStorage(this.STORAGE_KEY, filteredProjects);
      
      // TODO: Add cleanup of WebContainer workspace when API supports it
    } catch (error) {
      console.error('Failed to delete project:', error);
      throw new Error('Failed to delete project');
    }
  }

  private static async getProject(projectId: string): Promise<Project | null> {
    const projects = await loadFromLocalStorage<Project[]>(this.STORAGE_KEY, []);
    return projects.find(p => p.id === projectId) || null;
  }
}