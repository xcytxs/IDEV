import { useEffect, useState } from 'react';
import { WebContainer } from '@webcontainer/api';

export function useWebContainer() {
  const [container, setContainer] = useState<WebContainer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function bootContainer() {
      try {
        const webcontainer = await WebContainer.boot();
        await initializeContainer(webcontainer);
        setContainer(webcontainer);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to boot WebContainer'));
      } finally {
        setIsLoading(false);
      }
    }

    bootContainer();
  }, []);

  async function initializeContainer(webcontainer: WebContainer) {
    await webcontainer.mount({
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
  }

  return { container, isLoading, error };
}