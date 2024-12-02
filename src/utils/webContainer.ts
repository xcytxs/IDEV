import { WebContainer } from '@webcontainer/api';

class WebContainerManager {
  private static instance: WebContainer | null = null;
  private static isInitializing = false;
  private static initPromise: Promise<void> | null = null;
  private static workspaceRoot = '/workspace';

  static async getInstance(): Promise<WebContainer> {
    if (!this.instance) {
      if (!this.initPromise) {
        this.initPromise = this.initialize();
      }
      await this.initPromise;
    }
    return this.instance!;
  }

  private static async initialize() {
    if (this.isInitializing) return;
    
    this.isInitializing = true;
    try {
      this.instance = await WebContainer.boot();
      await this.setupContainer();
    } catch (error) {
      console.error('Failed to initialize WebContainer:', error);
      throw error;
    } finally {
      this.isInitializing = false;
      this.initPromise = null;
    }
  }

  private static async setupContainer() {
    if (!this.instance) return;

    try {
      // Create workspace directory
      await this.instance.fs.mkdir(this.workspaceRoot, { recursive: true });

      // Initialize with a base package.json
      await this.instance.mount({
        'package.json': {
          file: {
            contents: JSON.stringify({
              name: 'project-workspace',
              type: 'module',
              private: true,
              scripts: {
                start: 'node index.js'
              }
            }, null, 2)
          }
        }
      });

      console.log('WebContainer initialized successfully');
    } catch (error) {
      console.error('Error setting up container:', error);
      throw error;
    }
  }

  static async createWorkspace(path: string) {
    const container = await this.getInstance();
    const fullPath = path.startsWith('/') ? path : `${this.workspaceRoot}/${path}`;
    await container.fs.mkdir(fullPath, { recursive: true });
    return fullPath;
  }

  static async writeFile(path: string, contents: string) {
    const container = await this.getInstance();
    const fullPath = path.startsWith('/') ? path : `${this.workspaceRoot}/${path}`;
    
    // Ensure directory exists
    const dirPath = fullPath.substring(0, fullPath.lastIndexOf('/'));
    await this.createWorkspace(dirPath);

    // Write file
    const encoder = new TextEncoder();
    await container.fs.writeFile(fullPath, encoder.encode(contents));
  }

  static async readFile(path: string): Promise<string> {
    const container = await this.getInstance();
    const fullPath = path.startsWith('/') ? path : `${this.workspaceRoot}/${path}`;
    try {
      const data = await container.fs.readFile(fullPath);
      const decoder = new TextDecoder();
      return decoder.decode(data);
    } catch (error) {
      console.error(`Error reading file: ${path}`, error);
      throw error;
    }
  }

  static async fileExists(path: string): Promise<boolean> {
    try {
      const container = await this.getInstance();
      const fullPath = path.startsWith('/') ? path : `${this.workspaceRoot}/${path}`;
      await container.fs.stat(fullPath);
      return true;
    } catch {
      return false;
    }
  }

  static async listFiles(path: string): Promise<string[]> {
    const container = await this.getInstance();
    const fullPath = path.startsWith('/') ? path : `${this.workspaceRoot}/${path}`;
    try {
      const entries = await container.fs.readdir(fullPath, { withFileTypes: true });
      return entries.map(entry => entry.name);
    } catch (error) {
      console.error(`Error listing files: ${path}`, error);
      return [];
    }
  }
}

export { WebContainerManager };