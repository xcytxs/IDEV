import React, { useState } from 'react';
import { Project } from '../../types/project';
import { Agent } from '../../types/agent';
import { useProjectStore } from '../../store/projectStore';
import { useProjectInitialization } from '../../hooks/useProjectInitialization';
import { useAgentInitialization } from '../../hooks/useAgentInitialization';
import FileExplorer from './FileExplorer';
import UnifiedChat from '../chat/UnifiedChat';
import Editor from '@monaco-editor/react';
import Terminal from '../Terminal';
import { Terminal as TerminalIcon, Play, MessageSquare, Search, Save } from 'lucide-react';

interface ProjectWorkspaceProps {
  project: Project;
  agent: Agent;
  onSave: (file: ProjectFile) => void;
  onRun: () => void;
  onBuild: () => void;
  onProjectUpdate: (projectId: string, updates: Partial<Project>) => void;
}

const ProjectWorkspace: React.FC<ProjectWorkspaceProps> = ({
  project,
  agent,
  onSave,
  onRun,
  onBuild,
  onProjectUpdate,
}) => {
  const [isFileExplorerCollapsed, setIsFileExplorerCollapsed] = useState(false);
  const [isChatCollapsed, setIsChatCollapsed] = useState(false);
  const [isTerminalCollapsed, setIsTerminalCollapsed] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const {
    selectedFile,
    setSelectedFile,
    updateFile,
    isLoading,
    error
  } = useProjectStore();

  const projectInitialized = useProjectInitialization(project);
  const agentInitialized = useAgentInitialization(agent);

  const handleFileSave = async () => {
    if (selectedFile) {
      await onSave(selectedFile);
    }
  };

  const handleFileSelect = (file: ProjectFile) => {
    setSelectedFile(file);
  };

  const handleEditorChange = (value: string | undefined) => {
    if (selectedFile && value) {
      updateFile({
        ...selectedFile,
        content: value,
        lastModified: new Date().toISOString()
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error: {error}
      </div>
    );
  }

  if (!projectInitialized || !agentInitialized) {
    return null;
  }

  return (
    <div className="flex flex-col h-full bg-gray-900 text-gray-100 overflow-hidden">
      {/* Top Bar */}
      <div className="border-b border-gray-700 px-4 py-2 flex items-center justify-between bg-gray-800">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold">{project.name}</h1>
          <div className="flex items-center bg-gray-700 rounded-lg px-3 py-1">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search files..."
              className="bg-transparent border-none focus:outline-none text-sm ml-2 w-48"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleFileSave}
            className="p-2 hover:bg-gray-700 rounded"
            disabled={!selectedFile}
          >
            <Save size={20} />
          </button>
          <button
            onClick={onRun}
            className="bg-green-600 text-white px-3 py-1 rounded-lg flex items-center hover:bg-green-700"
          >
            <Play size={16} className="mr-1" />
            Run
          </button>
          <button
            onClick={() => setIsTerminalCollapsed(!isTerminalCollapsed)}
            className={`p-2 rounded transition-colors ${
              isTerminalCollapsed ? 'hover:bg-gray-700' : 'bg-gray-700'
            }`}
          >
            <TerminalIcon size={20} />
          </button>
          <button
            onClick={() => setIsChatCollapsed(!isChatCollapsed)}
            className={`p-2 rounded transition-colors ${
              isChatCollapsed ? 'hover:bg-gray-700' : 'bg-gray-700'
            }`}
          >
            <MessageSquare size={20} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* File Explorer */}
        <div
          className={`transition-all duration-300 ${
            isFileExplorerCollapsed ? 'w-0' : 'w-64'
          } border-r border-gray-700 bg-gray-800 overflow-hidden`}
        >
          {!isFileExplorerCollapsed && (
            <FileExplorer
              files={project.files}
              onFileSelect={handleFileSelect}
              selectedFile={selectedFile}
            />
          )}
        </div>

        {/* Editor */}
        <div className="flex-1 overflow-hidden">
          {selectedFile ? (
            <Editor
              height="100%"
              theme="vs-dark"
              path={selectedFile.path}
              defaultLanguage={selectedFile.type}
              value={selectedFile.content}
              onChange={handleEditorChange}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
                automaticLayout: true,
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a file to edit
            </div>
          )}
        </div>

        {/* Chat Panel */}
        <div
          className={`transition-all duration-300 ${
            isChatCollapsed ? 'w-0' : 'w-96'
          } border-l border-gray-700 bg-gray-800 overflow-hidden`}
        >
          {!isChatCollapsed && (
            <UnifiedChat
              project={project}
              onUpdateProject={(updates) => onProjectUpdate(project.id, updates)}
            />
          )}
        </div>
      </div>

      {/* Terminal */}
      <div
        className={`transition-all duration-300 ${
          isTerminalCollapsed ? 'h-0' : 'h-64'
        } border-t border-gray-700 bg-gray-800 overflow-hidden`}
      >
        {!isTerminalCollapsed && <Terminal />}
      </div>
    </div>
  );
}

export default ProjectWorkspace;