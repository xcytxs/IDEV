import { WebContainer } from '@webcontainer/api';

export class ContainerService {
  private static instance: WebContainer | null = null;
  private static isInitializing = false;
  private static initPromise: Promise<void> | null = null;

  static async getInstance(): Promise<WebContainer> {
    if (!this.instance) {
      if (!this.initPromise) {
        this.initPromise = this.initialize();
      }
      await this.initPromise;
    }
    return this.instance!;
  }

  private static async initialize(): Promise<void> {
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

  private static async setupContainer(): Promise<void> {
    if (!this.instance) return;

    try {
      await this.instance.mount({
        'package.json': {
          file: {
            contents: JSON.stringify({
              name: 'project-workspace',
              type: 'module',
              private: true,
              scripts: {
                dev: 'vite',
                build: 'vite build',
                preview: 'vite preview'
              },
              dependencies: {
                "react": "18.2.0",
                "react-dom": "18.2.0",
                "vite": "5.1.6"
              }
            }, null, 2)
          }
        }
      });

      // Install base dependencies
      const installProcess = await this.instance.spawn('npm', ['install']);
      const exitCode = await installProcess.exit;

      if (exitCode !== 0) {
        throw new Error('Failed to install base dependencies');
      }

      console.log('WebContainer initialized successfully');
    } catch (error) {
      console.error('Error setting up container:', error);
      throw error;
    }
  }

  static async executeCommand(
    command: string,
    args: string[] = [],
    options: { cwd?: string; env?: Record<string, string> } = {}
  ): Promise<{
    output: string;
    error?: string;
  }> {
    const container = await this.getInstance();
    
    const process = await container.spawn(command, args, {
      cwd: options.cwd,
      env: {
        ...process.env,
        ...options.env,
      },
    });
    
    let output = '';
    let error = '';

    process.output.pipeTo(
      new WritableStream({
        write(data) {
          output += data;
          console.log(data);
        },
      })
    );

    process.error.pipeTo(
      new WritableStream({
        write(data) {
          error += data;
          console.error(data);
        },
      })
    );

    const exitCode = await process.exit;
    
    return {
      output: output.trim(),
      ...(exitCode !== 0 && { error: error.trim() })
    };
  }
}