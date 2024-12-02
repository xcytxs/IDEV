import React, { useState, useMemo } from 'react';
import { 
  File, 
  Folder, 
  ChevronRight, 
  ChevronDown,
  FileText,
  FileJson,
  FileCode,
  Image,
  Coffee,
  Hash
} from 'lucide-react';
import { ProjectFile } from '../../types/project';

interface FileExplorerProps {
  files: ProjectFile[];
  onFileSelect: (file: ProjectFile) => void;
  selectedFile?: ProjectFile | null;
}

const FileExplorer: React.FC<FileExplorerProps> = ({
  files,
  onFileSelect,
  selectedFile,
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['/']));

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'json':
        return <FileJson size={16} className="text-yellow-400" />;
      case 'js':
      case 'jsx':
        return <FileCode size={16} className="text-yellow-300" />;
      case 'ts':
      case 'tsx':
        return <FileCode size={16} className="text-blue-400" />;
      case 'css':
      case 'scss':
        return <FileCode size={16} className="text-pink-400" />;
      case 'html':
        return <FileCode size={16} className="text-orange-400" />;
      case 'md':
        return <FileText size={16} className="text-gray-400" />;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
        return <Image size={16} className="text-purple-400" />;
      case 'java':
        return <Coffee size={16} className="text-red-400" />;
      case 'py':
        return <Hash size={16} className="text-green-400" />;
      default:
        return <File size={16} className="text-gray-400" />;
    }
  };

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const fileTree = useMemo(() => {
    const tree: { [key: string]: ProjectFile[] } = { '/': [] };
    
    files.forEach(file => {
      const parts = file.path.split('/').filter(Boolean);
      let currentPath = '';
      
      parts.forEach((part, index) => {
        const isLast = index === parts.length - 1;
        currentPath += `/${part}`;
        
        if (!tree[currentPath]) {
          tree[currentPath] = [];
        }
        
        if (isLast) {
          tree[currentPath].push(file);
        }
      });
    });
    
    return tree;
  }, [files]);

  const renderFileTree = (path: string = '/') => {
    const currentFiles = fileTree[path] || [];
    const subFolders = Object.keys(fileTree)
      .filter(p => p.startsWith(path) && p !== path && !p.slice(path.length + 1).includes('/'))
      .sort();

    return (
      <div className="pl-4">
        {subFolders.map(folder => (
          <div key={folder}>
            <div
              className="flex items-center space-x-1 cursor-pointer hover:bg-gray-700 py-1 px-2 rounded group"
              onClick={() => toggleFolder(folder)}
            >
              {expandedFolders.has(folder) ? (
                <ChevronDown size={16} className="text-gray-400" />
              ) : (
                <ChevronRight size={16} className="text-gray-400" />
              )}
              <Folder size={16} className="text-blue-400" />
              <span className="text-sm">{folder.split('/').pop()}</span>
            </div>
            {expandedFolders.has(folder) && renderFileTree(folder)}
          </div>
        ))}
        {currentFiles.map(file => (
          <div
            key={file.path}
            className={`flex items-center space-x-2 cursor-pointer hover:bg-gray-700 py-1 px-2 rounded ml-6 group ${
              selectedFile?.id === file.id ? 'bg-gray-700' : ''
            }`}
            onClick={() => onFileSelect(file)}
          >
            {getFileIcon(file.name)}
            <span className="text-sm">{file.name}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="overflow-y-auto h-full text-gray-100">
      {renderFileTree()}
    </div>
  );
};

export default FileExplorer;