import { Agent } from '../types/agent';
import { Project, ProjectFile } from '../types/project';
import { fileSystem } from '../utils/fileSystem';

export class AgentService {
  static async handleMessage(agent: Agent, project: Project, message: string): Promise<{
    response: string;
    files?: ProjectFile[];
    actions?: string[];
  }> {
    if (!agent.capabilities) {
      return {
        response: "I don't have the necessary capabilities to help with that.",
      };
    }

    try {
      // Handle project analysis request
      if (message.toLowerCase().includes('analyze')) {
        return await this.analyzeProject(agent, project);
      }

      // Handle game creation request
      if (message.toLowerCase().includes('game') || message.toLowerCase().includes('code the game')) {
        return await this.createGame(agent, project);
      }

      // Handle file creation request
      if (message.toLowerCase().includes('create') || message.toLowerCase().includes('new file')) {
        return await this.handleFileCreation(agent, project, message);
      }

      // Handle file modification request
      if (message.toLowerCase().includes('modify') || message.toLowerCase().includes('update file')) {
        return await this.handleFileModification(agent, project, message);
      }

      // Default response with project context
      return {
        response: `I understand your request: "${message}". I can help you with:\n\n` +
          "1. Creating new files\n" +
          "2. Modifying existing files\n" +
          "3. Analyzing project structure\n" +
          "4. Creating and managing game code\n\n" +
          "What would you like me to do?",
      };
    } catch (error) {
      console.error('Error handling message:', error);
      return {
        response: "I encountered an error while processing your request. Please try again.",
        actions: ['Error occurred while processing request']
      };
    }
  }

  private static async analyzeProject(agent: Agent, project: Project) {
    if (!agent.capabilities?.canAccessFiles) {
      return {
        response: "I don't have permission to analyze project files.",
      };
    }

    const analysis = {
      projectType: project.type,
      framework: project.framework,
      language: project.language,
      fileCount: project.files.length,
      structure: await this.analyzeProjectStructure(project),
      suggestions: this.generateProjectSuggestions(project),
    };

    const analysisFile: ProjectFile = {
      id: `analysis-${Date.now()}`,
      name: 'project-analysis.json',
      path: '/project-analysis.json',
      content: JSON.stringify(analysis, null, 2),
      type: 'json',
      lastModified: new Date().toISOString(),
    };

    await fileSystem.writeFile(analysisFile);

    return {
      response: "I've analyzed the project structure. Here's what I found:\n\n" +
        `Project Type: ${analysis.projectType}\n` +
        `Framework: ${analysis.framework}\n` +
        `Language: ${analysis.language}\n` +
        `Number of Files: ${analysis.fileCount}\n\n` +
        "Suggestions:\n" +
        analysis.suggestions.map(s => `- ${s}`).join('\n') + "\n\n" +
        "Would you like me to help you implement any of these suggestions?",
      files: [analysisFile],
      actions: ['Analyzed project structure', 'Created analysis file']
    };
  }

  private static async createGame(agent: Agent, project: Project) {
    if (!agent.capabilities?.canAccessFiles) {
      return {
        response: "I don't have permission to create game files.",
      };
    }

    const gameFiles: ProjectFile[] = [
      {
        id: `game-${Date.now()}`,
        name: 'Game.tsx',
        path: '/src/components/Game.tsx',
        content: `import React, { useState, useEffect, useCallback } from 'react';

interface Position {
  x: number;
  y: number;
}

interface GameState {
  snake: Position[];
  food: Position;
  direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
  gameOver: boolean;
  score: number;
}

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE: Position[] = [{ x: 10, y: 10 }];
const INITIAL_FOOD: Position = { x: 15, y: 15 };

const Game: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    snake: INITIAL_SNAKE,
    food: INITIAL_FOOD,
    direction: 'RIGHT',
    gameOver: false,
    score: 0,
  });

  const moveSnake = useCallback(() => {
    if (gameState.gameOver) return;

    const newSnake = [...gameState.snake];
    const head = { ...newSnake[0] };

    switch (gameState.direction) {
      case 'UP':
        head.y = (head.y - 1 + GRID_SIZE) % GRID_SIZE;
        break;
      case 'DOWN':
        head.y = (head.y + 1) % GRID_SIZE;
        break;
      case 'LEFT':
        head.x = (head.x - 1 + GRID_SIZE) % GRID_SIZE;
        break;
      case 'RIGHT':
        head.x = (head.x + 1) % GRID_SIZE;
        break;
    }

    // Check collision with self
    if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
      setGameState(prev => ({ ...prev, gameOver: true }));
      return;
    }

    newSnake.unshift(head);

    // Check if food is eaten
    if (head.x === gameState.food.x && head.y === gameState.food.y) {
      const newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      setGameState(prev => ({
        ...prev,
        food: newFood,
        score: prev.score + 1,
      }));
    } else {
      newSnake.pop();
    }

    setGameState(prev => ({ ...prev, snake: newSnake }));
  }, [gameState]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (gameState.direction !== 'DOWN') {
            setGameState(prev => ({ ...prev, direction: 'UP' }));
          }
          break;
        case 'ArrowDown':
          if (gameState.direction !== 'UP') {
            setGameState(prev => ({ ...prev, direction: 'DOWN' }));
          }
          break;
        case 'ArrowLeft':
          if (gameState.direction !== 'RIGHT') {
            setGameState(prev => ({ ...prev, direction: 'LEFT' }));
          }
          break;
        case 'ArrowRight':
          if (gameState.direction !== 'LEFT') {
            setGameState(prev => ({ ...prev, direction: 'RIGHT' }));
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    const gameLoop = setInterval(moveSnake, 100);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      clearInterval(gameLoop);
    };
  }, [moveSnake]);

  const resetGame = () => {
    setGameState({
      snake: INITIAL_SNAKE,
      food: INITIAL_FOOD,
      direction: 'RIGHT',
      gameOver: false,
      score: 0,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="mb-4">
        <h1 className="text-3xl font-bold">Snake Game</h1>
        <p className="text-xl">Score: {gameState.score}</p>
      </div>
      
      <div 
        className="relative bg-gray-800 border-2 border-gray-700"
        style={{ 
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE 
        }}
      >
        {gameState.snake.map((segment, index) => (
          <div
            key={index}
            className="absolute bg-green-500"
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
              left: segment.x * CELL_SIZE,
              top: segment.y * CELL_SIZE,
            }}
          />
        ))}
        <div
          className="absolute bg-red-500"
          style={{
            width: CELL_SIZE,
            height: CELL_SIZE,
            left: gameState.food.x * CELL_SIZE,
            top: gameState.food.y * CELL_SIZE,
          }}
        />
      </div>

      {gameState.gameOver && (
        <div className="mt-4">
          <p className="text-xl text-red-500 mb-2">Game Over!</p>
          <button
            onClick={resetGame}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Play Again
          </button>
        </div>
      )}

      <div className="mt-4 text-gray-400">
        <p>Use arrow keys to control the snake</p>
      </div>
    </div>
  );
};

export default Game;`,
        type: 'tsx',
        lastModified: new Date().toISOString(),
      },
      {
        id: `app-${Date.now()}`,
        name: 'App.tsx',
        path: '/src/App.tsx',
        content: `import React from 'react';
import Game from './components/Game';

function App() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Game />
    </div>
  );
}

export default App;`,
        type: 'tsx',
        lastModified: new Date().toISOString(),
      }
    ];

    // Create all game files
    for (const file of gameFiles) {
      await fileSystem.writeFile(file);
    }

    return {
      response: "I've created a Snake game implementation with the following features:\n\n" +
        "1. Responsive game board\n" +
        "2. Score tracking\n" +
        "3. Collision detection\n" +
        "4. Game over state\n" +
        "5. Reset functionality\n\n" +
        "The game is now ready to play. Use the arrow keys to control the snake. Would you like me to explain any part of the implementation or make any modifications?",
      files: gameFiles,
      actions: ['Created game components', 'Updated App component']
    };
  }

  private static async analyzeProjectStructure(project: Project) {
    const structure: Record<string, string[]> = {};
    
    for (const file of project.files) {
      const dir = file.path.split('/').slice(0, -1).join('/') || '/';
      if (!structure[dir]) {
        structure[dir] = [];
      }
      structure[dir].push(file.path.split('/').pop() || '');
    }

    return structure;
  }

  private static generateProjectSuggestions(project: Project): string[] {
    const suggestions: string[] = [];

    if (!project.files.some(f => f.path.includes('README.md'))) {
      suggestions.push('Create a README.md file to document the project');
    }

    if (project.type === 'code') {
      if (!project.files.some(f => f.path.includes('tsconfig.json'))) {
        suggestions.push('Add TypeScript configuration');
      }
      if (!project.files.some(f => f.path.includes('package.json'))) {
        suggestions.push('Initialize package.json');
      }
      if (!project.files.some(f => f.path.includes('Game.tsx'))) {
        suggestions.push('Create the main Game component');
      }
    }

    return suggestions;
  }

  private static async handleFileCreation(agent: Agent, project: Project, message: string) {
    if (!agent.capabilities?.canAccessFiles) {
      return {
        response: "I don't have permission to create files.",
      };
    }

    const fileMatch = message.match(/create\s+(?:a\s+)?(\w+)\s+file(?:\s+called\s+)?(?:named\s+)?([\/\w\-\.]+)?/i);
    if (!fileMatch) {
      return {
        response: "I can help create files. Please specify the type and name of the file you'd like to create.",
      };
    }

    const [, fileType, fileName = `new-${fileType}.${fileType}`] = fileMatch;
    const filePath = fileName.startsWith('/') ? fileName : `/${fileName}`;

    const newFile: ProjectFile = {
      id: `file-${Date.now()}`,
      name: fileName.split('/').pop() || fileName,
      path: filePath,
      content: this.getInitialContent(fileType, project),
      type: fileType,
      lastModified: new Date().toISOString(),
    };

    await fileSystem.writeFile(newFile);

    return {
      response: `I've created a new ${fileType} file at ${filePath}. Would you like me to explain the file structure or make any modifications?`,
      files: [newFile],
      actions: [`Created ${fileType} file: ${filePath}`]
    };
  }

  private static async handleFileModification(agent: Agent, project: Project, message: string) {
    if (!agent.capabilities?.canAccessFiles) {
      return {
        response: "I don't have permission to modify files.",
      };
    }

    const fileMatch = message.match(/(?:modify|update)\s+file\s+([\/\w\-\.]+)/i);
    if (!fileMatch) {
      return {
        response: "Please specify which file you'd like to modify.",
      };
    }

    const [, filePath] = fileMatch;
    const file = project.files.find(f => f.path === filePath);

    if (!file) {
      return {
        response: `File not found: ${filePath}. Would you like me to create it?`,
      };
    }

    const updatedFile: ProjectFile = {
      ...file,
      content: `${file.content}\n// Modified: ${new Date().toISOString()}`,
      lastModified: new Date().toISOString(),
    };

    await fileSystem.writeFile(updatedFile);

    return {
      response: `I've updated the file at ${filePath}. Would you like to see the changes?`,
      files: [updatedFile],
      actions: [`Modified file: ${filePath}`]
    };
  }

  private static getInitialContent(fileType: string, project: Project): string {
    switch (fileType.toLowerCase()) {
      case 'typescript':
      case 'ts':
        return `// ${project.name}\n// Created: ${new Date().toISOString()}\n\nexport {};\n`;
      case 'javascript':
      case 'js':
        return `// ${project.name}\n// Created: ${new Date().toISOString()}\n\n`;
      case 'json':
        return '{\n  \n}';
      case 'html':
        return '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Document</title>\n</head>\n<body>\n  \n</body>\n</html>';
      case 'css':
        return '/* Styles */\n\n';
      case 'md':
        return `# ${project.name}\n\n## Overview\n\n`;
      default:
        return '';
    }
  }
}