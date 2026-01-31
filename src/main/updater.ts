import { BrowserWindow, dialog } from "electron";
import { autoUpdater } from 'electron-updater'
import { getLocalizationContext } from "./localization";

autoUpdater.setFeedURL({
  provider: 'github',
  owner: 'iosona',
  repo: 'SonaClient'
});

autoUpdater.autoDownload = false;

export function setupUpdater(mainWindow: BrowserWindow) {
  autoUpdater.on('update-available', async (info) => {
    const context = await getLocalizationContext(mainWindow);

    dialog.showMessageBox({
      type: 'info',
      title: context.UpdateAvailable,
      message: `${context.VersionFound} ${info.version}. ${context.DownloadNow}`,
      buttons: [context.Yes, context.Later]
    }).then(result => {
      if (result.response === 0) autoUpdater.downloadUpdate();
    });
  });

  autoUpdater.on('download-progress', (progressObj) => {
    let log_message = "Speed: " + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    console.log(log_message); 
  });

  autoUpdater.on('update-downloaded', async () => {
    const context = await getLocalizationContext(mainWindow);
    
    dialog.showMessageBox({
      title: context.ReadyToInstall,
      message: context.UpdateDownloaded,
      buttons: [context.Restart, context.Later]
    }).then(result => {
      if (result.response === 0) autoUpdater.quitAndInstall();
    });
  });

  autoUpdater.checkForUpdatesAndNotify();
}
