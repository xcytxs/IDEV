import { useState, useCallback, useEffect, useRef } from 'react';
import { Project, ProjectFile } from '../types/project';
import { orchestratorService } from '../services/orchestratorService';
import { ProjectContext } from '../types/orchestrator';

export function useProject(project: Project) {
  const [files, setFiles] = useState<ProjectFile[]>(project.files);
  const [selectedFile, setSelectedFile] = useState<ProjectFile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [context, setContext] = useState<ProjectContext | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    const initializeProject = async () => {
      if (initialized.current) return;
      
      try {
        setIsLoading(true);
        const projectContext = await orchestratorService.initializeProject(project);
        setContext(projectContext);
        initialized.current = true;
      } catch (err) {
        console.error('Failed to initialize project:', err);
        setError('Failed to initialize project. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    initializeProject();
  }, [project.id]);

  const loadFile = useCallback(async (file: ProjectFile) => {
    setIsLoading(true);
    setError(null);
    try {
      setSelectedFile(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load file');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveFile = useCallback(async (file: ProjectFile) => {
    setIsLoading(true);
    setError(null);
    try {
      setFiles(prev => prev.map(f => f.id === file.id ? file : f));
      setSelectedFile(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save file');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createFile = useCallback(async (path: string, content: string = '') => {
    setIsLoading(true);
    setError(null);
    try {
      const newFile: ProjectFile = {
        id: `${Date.now()}`,
        name: path.split('/').pop() || '',
        path,
        content,
        lastModified: new Date().toISOString(),
        type: path.split('.').pop() || 'txt'
      };
      setFiles(prev => [...prev, newFile]);
      return newFile;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create file');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    files,
    selectedFile,
    isLoading,
    error,
    context,
    loadFile,
    saveFile,
    createFile,
    setSelectedFile
  };
}