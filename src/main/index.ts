import { app, shell, BrowserWindow, dialog, desktopCapturer, session, ipcMain } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { APP_SETTINGS } from './constants'
import { getContentHash } from './security';
import { showNotify } from './notify';
import { chmodSync, copyFileSync, existsSync, writeFileSync } from 'fs';
import path from 'path';
import { setupUpdater } from './updater';

let mainWindow: BrowserWindow;
let displayId: string | null = null;

function integrateAppImage() {
  if (process.platform !== 'linux' || !process.env.APPIMAGE || is.dev) return;

  const desktopFilePath = path.join(app.getPath('home'), '.local/share/applications', 'sona.desktop');
  const iconFilePath = path.join(app.getPath('home'), '.local/share/icons/hicolor/256x256/apps/sona.png');

  if (existsSync(desktopFilePath)) return;

  const appPath = process.env.APPIMAGE;
  const iconPath = path.join(process.resourcesPath, '../sona.png');

  try {
    copyFileSync(iconPath, iconFilePath);
  } catch (error) {
    console.error("Failed to copy icon", error);
    return;
  }
  
  const desktopEntry = `
      [Desktop Entry]
      Name=Sona
      Exec=${appPath}
      Icon=${iconFilePath}
      Type=Application
      Categories=Network;Chat;
      Terminal=false
  `;

  try {
    writeFileSync(desktopFilePath, desktopEntry);
    chmodSync(desktopFilePath, '0755');
    console.log('AppImage has been integrated to system');
  } 
  catch (err) {
    console.error('Failed to create shortcut', err);
  }
}

function initMainIpc() {
  ipcMain.on('minimize', () => mainWindow.minimize());
  ipcMain.on('close', () => mainWindow.close())
  ipcMain.on("notify", (_, title, body) => showNotify(mainWindow, title, body));
  ipcMain.on('maximize', () => mainWindow.isMaximized() ? mainWindow.restore() : mainWindow.maximize());
  ipcMain.handle('set-display-id', (_, id) => { 
    displayId = id
    return; 
  });
  ipcMain.handle('get-hash', () => getContentHash());
  ipcMain.handle('get-screen-sources', async (_, options) => {
    const sources = await desktopCapturer.getSources(options);
    return sources.map(src => ({
        id: src.id,
        name: src.name,
        image: src.thumbnail.toDataURL(),
    }));
  });
}

function displayMediaHandler() {
  session.defaultSession.setDisplayMediaRequestHandler((_, callback) => {
      desktopCapturer.getSources({ types: ['screen', 'window'] }).then((sources) => {
        let selectedDisplayId: string | null = null;
        if (process.platform !== 'win32' && sources[0]) {
          selectedDisplayId = sources[0].id;
        }
        try {
          if (!displayId && !selectedDisplayId) {
            callback({});
            return;
          }
          else {
            const videoSource = process.platform !== 'win32' 
              ? sources[0] 
              : sources.find(src => src.id === displayId)
            callback({ 
              video: videoSource, 
              audio: 'loopback' 
            }); 
          }
        }
        catch (e) {
          callback({});
        }
      }).catch(_ => {
        callback({});
      });
  });
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: APP_SETTINGS.width,
    height: APP_SETTINGS.height,
    minWidth: APP_SETTINGS.minWidth,
    minHeight: APP_SETTINGS.minHeight,
    show: false,
    titleBarStyle: "hidden",
    autoHideMenuBar: true,
    ...APP_SETTINGS.icon,
    webPreferences: {
      preload: APP_SETTINGS.preloadPath,
      sandbox: false,
      nodeIntegration: false,
      contextIsolation: true,
      devTools: is.dev
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.on('close', e => {
    e.preventDefault();
    const response = dialog.showMessageBoxSync(mainWindow, {
        type: 'question',
        buttons: ['Выйти', 'Отмена'],
        title: 'Выход',
        message: 'Вы действительно хотите выйти?',
    });
 
    if (response === 0) {
        mainWindow.destroy();
        app.quit();
    }
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(APP_SETTINGS.indexHtml)
  }

  return mainWindow
}

app.whenReady().then(async () => {
  integrateAppImage();
  setupUpdater();

  if (process.platform === 'win32') {
    electronApp.setAppUserModelId('com.sona.app')
  }

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  await createWindow();
  
  initMainIpc();
  displayMediaHandler();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})