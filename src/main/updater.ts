import { dialog } from "electron";
import { autoUpdater } from 'electron-updater'

autoUpdater.setFeedURL({
  provider: 'github',
  owner: 'iosona',
  repo: 'SonaClient'
});

autoUpdater.autoDownload = false;

export function setupUpdater() {
  autoUpdater.on('update-available', (info) => {
    dialog.showMessageBox({
      type: 'info',
      title: 'Обновление доступно',
      message: `Найдена версия ${info.version}. Скачать сейчас?`,
      buttons: ['Да', 'Позже']
    }).then(result => {
      if (result.response === 0) autoUpdater.downloadUpdate();
    });
  });

  autoUpdater.on('download-progress', (progressObj) => {
    let log_message = "Скорость: " + progressObj.bytesPerSecond;
    log_message = log_message + ' - Скачано ' + progressObj.percent + '%';
    console.log(log_message); 
  });

  autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox({
      title: 'Готово к установке',
      message: 'Обновление скачано. Перезапустить приложение сейчас?',
      buttons: ['Перезапустить', 'Позже']
    }).then(result => {
      if (result.response === 0) autoUpdater.quitAndInstall();
    });
  });

  autoUpdater.checkForUpdatesAndNotify();
}
