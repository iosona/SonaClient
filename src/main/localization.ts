import ru from '../../resources/localization/ru.json';
import ch from '../../resources/localization/ch.json';
import de from '../../resources/localization/de.json';
import en from '../../resources/localization/en.json';
import fr from '../../resources/localization/fr.json';
import sp from '../../resources/localization/sp.json';
import uk from '../../resources/localization/uk.json';
import { BrowserWindow } from 'electron';

const TRANSLATION = { ru, ch, de, en, fr, sp, uk }

export async function getLocalizationContext(mainWindow: BrowserWindow) {
    const lang = await mainWindow.webContents.executeJavaScript('localStorage.getItem("i18nextLng");') || "en";
    return TRANSLATION[lang];
}