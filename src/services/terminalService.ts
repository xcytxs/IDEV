import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';

export class TerminalService {
  private terminal: Terminal;
  private fitAddon: FitAddon;
  private isDisposed = false;

  constructor() {
    this.fitAddon = new FitAddon();
    this.terminal = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      lineHeight: 1.5,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      allowProposedApi: true,
      theme: {
        background: '#1e1e1e',
        foreground: '#d4d4d4',
        cursor: '#aeafad',
        selection: '#264f78',
      }
    });

    this.terminal.loadAddon(this.fitAddon);
    this.terminal.loadAddon(new WebLinksAddon());
  }

  attach(element: HTMLElement): void {
    if (this.isDisposed) return;
    
    this.terminal.open(element);
    
    // Wait for the terminal to be properly mounted before fitting
    requestAnimationFrame(() => {
      if (!this.isDisposed && element.clientHeight > 0) {
        try {
          this.fitAddon.fit();
        } catch (error) {
          console.warn('Error fitting terminal:', error);
        }
      }
    });
  }

  write(text: string): void {
    if (!this.isDisposed) {
      this.terminal.write(text);
    }
  }

  writeLine(text: string): void {
    if (!this.isDisposed) {
      this.terminal.writeln(text);
    }
  }

  clear(): void {
    if (!this.isDisposed) {
      this.terminal.clear();
    }
  }

  dispose(): void {
    this.isDisposed = true;
    this.terminal.dispose();
  }

  fit(): void {
    if (!this.isDisposed) {
      try {
        this.fitAddon.fit();
      } catch (error) {
        console.warn('Error fitting terminal:', error);
      }
    }
  }

  onData(callback: (data: string) => void): void {
    if (!this.isDisposed) {
      this.terminal.onData(callback);
    }
  }

  onKey(callback: (key: { key: string; domEvent: KeyboardEvent }) => void): void {
    if (!this.isDisposed) {
      this.terminal.onKey(callback);
    }
  }

  focus(): void {
    if (!this.isDisposed) {
      this.terminal.focus();
    }
  }

  blur(): void {
    if (!this.isDisposed) {
      this.terminal.blur();
    }
  }
}

export const createTerminalService = () => new TerminalService();