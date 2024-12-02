import { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import 'xterm/css/xterm.css';

interface UseTerminalProps {
  containerId: string;
}

export function useTerminal({ containerId }: UseTerminalProps) {
  const terminalRef = useRef<Terminal>();
  const fitAddonRef = useRef<FitAddon>();

  useEffect(() => {
    if (!terminalRef.current) {
      fitAddonRef.current = new FitAddon();
      terminalRef.current = new Terminal({
        cursorBlink: true,
        fontSize: 14,
        lineHeight: 1.5,
        fontFamily: 'Menlo, Monaco, "Courier New", monospace',
        theme: {
          background: '#1e1e1e',
          foreground: '#d4d4d4',
          cursor: '#aeafad',
          selection: '#264f78',
        }
      });

      terminalRef.current.loadAddon(fitAddonRef.current);
      terminalRef.current.loadAddon(new WebLinksAddon());
    }

    return () => {
      terminalRef.current?.dispose();
    };
  }, [containerId]);

  const attachToElement = (element: HTMLElement) => {
    if (terminalRef.current && element) {
      terminalRef.current.open(element);
      fitAddonRef.current?.fit();
    }
  };

  const writeToTerminal = (text: string) => {
    terminalRef.current?.write(text);
  };

  const clearTerminal = () => {
    terminalRef.current?.clear();
  };

  return {
    attachToElement,
    writeToTerminal,
    clearTerminal,
    fitAddon: fitAddonRef.current,
  };
}