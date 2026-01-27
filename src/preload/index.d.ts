import { ElectronAPI } from '@electron-toolkit/preload'

export interface Api {
  minimize: () => void;
  maximize: () => void;
  close: () => void;
  setDisplayId: (id: string | null) => Promise<void>;
  getHash: () => Promise<string>;
  sendNotify: (title: string, body: string) => void;
  getScreenSources: () => Promise<Electron.DesktopCapturerSource[]>;
  openUrl: (url: string) => void;
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