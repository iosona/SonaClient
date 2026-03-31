import { ElectronAPI } from '@electron-toolkit/preload'
import { IServerInfo } from '@renderer/types';
import IRC from 'irc-framework';

export interface Api {
  minimize: () => void;
  maximize: () => void;
  close: () => void;
  setDisplayId: (id: string | null) => Promise<void>;
  getHash: () => Promise<string>;
  sendNotify: (title: string, body: string) => void;
  getScreenSources: () => Promise<Electron.DesktopCapturerSource[]>;
  openUrl: (url: string) => void;
  resizeWindow: (w: number, h: number) => void;
  saveServer: (server: any) => Promise<void>,
  deleteServer: (id: number) => Promise<void>,
  getServers: () => Promise<IServerInfo[]>
  pingServer: (host: string, port: number) => Promise<boolean>
}

export interface SysInfo {
  platform: 'win32' | 'darwin' | 'linux'
}

declare global {
  interface Window {
    api: Api
    sysInfo: SysInfo
  }
}