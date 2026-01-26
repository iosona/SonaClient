import { contextBridge, ipcRenderer } from 'electron'

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
  sendNotify: (title: string, body: string) => ipcRenderer.send('notify', title, body)
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