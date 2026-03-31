import { contextBridge, ipcRenderer, shell } from 'electron'

const api = {
  minimize: () => ipcRenderer.send('minimize'),
  maximize: () => ipcRenderer.send('maximize'),
  close: () => ipcRenderer.send('close'),
  setDisplayId: (id: string) => ipcRenderer.invoke('set-display-id', id),
  getHash: () => ipcRenderer.invoke('get-hash'),
  getScreenSources: () => ipcRenderer.invoke('get-screen-sources', {
    types: ['window', 'screen'],
    thumbnailSize: { width: 150, height: 100 }
  }),
  sendNotify: (title: string, body: string) => ipcRenderer.send('notify', title, body),
  openUrl: (url: string) => shell.openExternal(url),
  resizeWindow: (w: number, h: number) => ipcRenderer.send('resize', w, h),
  saveServer: (server: any) => ipcRenderer.invoke('save-server', server),
  deleteServer: (id: number) => ipcRenderer.invoke('delete-server', id),
  getServers: () => ipcRenderer.invoke('get-servers'),
  pingServer: (host: string, port: number) => ipcRenderer.invoke('check-server', host, port)
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('sysInfo', {
      platform: process.platform
    })
  } catch (error) {
    console.error(error)
  }
}