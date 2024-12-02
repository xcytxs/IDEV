import { create } from 'zustand';
import { Project, ProjectFile } from '../types/project';

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  files: ProjectFile[];
  selectedFile: ProjectFile | null;
  isLoading: boolean;
  error: string | null;
  setProjects: (projects: Project[]) => void;
  setCurrentProject: (project: Project | null) => void;
  setFiles: (files: ProjectFile[]) => void;
  setSelectedFile: (file: ProjectFile | null) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateFile: (file: ProjectFile) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  currentProject: null,
  files: [],
  selectedFile: null,
  isLoading: false,
  error: null,
  setProjects: (projects) => set({ projects }),
  setCurrentProject: (project) => set({ currentProject: project }),
  setFiles: (files) => set({ files }),
  setSelectedFile: (file) => set({ selectedFile: file }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  updateFile: (file) =>
    set((state) => ({
      files: state.files.map((f) => (f.id === file.id ? file : f)),
      selectedFile: state.selectedFile?.id === file.id ? file : state.selectedFile,
    })),
}));