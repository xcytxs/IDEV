import React, { useEffect, useRef } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import '@xterm/xterm/css/xterm.css';
import '../styles/terminal.css';

interface TerminalProps {
  className?: string;
}

const Terminal: React.FC<TerminalProps> = ({ className }) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm>();
  const fitAddonRef = useRef<FitAddon>();

  useEffect(() => {
    if (!terminalRef.current || xtermRef.current) return;

    // Initialize xterm.js
    const terminal = new XTerm({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      allowProposedApi: true,
      theme: {
        background: '#1e1e1e',
        foreground: '#d4d4d4',
        cursor: '#aeafad',
        selection: '#264f78',
        black: '#000000',
        red: '#cd3131',
        green: '#0dbc79',
        yellow: '#e5e510',
        blue: '#2472c8',
        magenta: '#bc3fbc',
        cyan: '#11a8cd',
        white: '#e5e5e5',
        brightBlack: '#666666',
        brightRed: '#f14c4c',
        brightGreen: '#23d18b',
        brightYellow: '#f5f543',
        brightBlue: '#3b8eea',
        brightMagenta: '#d670d6',
        brightCyan: '#29b8db',
        brightWhite: '#e5e5e5',
      },
    });

    xtermRef.current = terminal;

    // Add the fit addon
    const fitAddon = new FitAddon();
    fitAddonRef.current = fitAddon;
    terminal.loadAddon(fitAddon);
    terminal.loadAddon(new WebLinksAddon());

    // Create terminal container with header
    const container = document.createElement('div');
    container.className = 'terminal-container';
    
    const header = document.createElement('div');
    header.className = 'terminal-header';
    header.innerHTML = '<span class="terminal-header-title">Terminal</span>';
    
    const content = document.createElement('div');
    content.className = 'terminal-content';
    
    container.appendChild(header);
    container.appendChild(content);
    terminalRef.current.appendChild(container);

    // Open terminal in the content container
    terminal.open(content);

    // Initial fit
    requestAnimationFrame(() => {
      if (fitAddonRef.current && content.clientHeight > 0) {
        try {
          fitAddonRef.current.fit();
        } catch (error) {
          console.warn('Error fitting terminal:', error);
        }
      }
    });

    // Write initial text
    terminal.writeln('Welcome to the project terminal');
    terminal.writeln('Type "help" for available commands');
    terminal.write('\r\n$ ');

    // Handle window resize
    const handleResize = () => {
      if (fitAddonRef.current && xtermRef.current) {
        try {
          fitAddonRef.current.fit();
        } catch (error) {
          console.warn('Error fitting terminal:', error);
        }
      }
    };

    window.addEventListener('resize', handleResize);

    // Handle terminal input
    terminal.onData(data => {
      terminal.write(data);
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      if (xtermRef.current) {
        xtermRef.current.dispose();
      }
    };
  }, []);

  return (
    <div 
      ref={terminalRef} 
      className={`${className} h-full bg-[#1e1e1e]`}
    />
  );
};

export default Terminal;