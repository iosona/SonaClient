import { BrowserWindow, Notification } from "electron";
import { APP_SETTINGS, MAX_NOTIFY_COUNT } from "./constants";

let notifyCount = 0;

export function showNotify(windowInst: BrowserWindow, title: string, body: string) {
    if (BrowserWindow.getFocusedWindow() || notifyCount >= MAX_NOTIFY_COUNT) {
        return;
    }

    const notify = new Notification({
        title,
        body,
        icon: APP_SETTINGS.icon.icon
    });
    notifyCount++;
    notify.on('click', () => windowInst.show());
    notify.on('close', () => notifyCount--);
    notify.show();
}