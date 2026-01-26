import { join } from "path";
import icon from '../../resources/sona.png?asset'

export const APP_SETTINGS = {
    width: 700,
    height: 600,
    minWidth: 700,
    minHeight: 600,
    preloadPath: join(__dirname, '../preload/index.js'),
    icon: (process.platform === 'linux' ? { icon } : {}),
    indexHtml: join(__dirname, '../renderer/index.html')
}

export const MAX_NOTIFY_COUNT = 3