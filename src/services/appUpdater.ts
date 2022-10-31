import { BrowserWindow, Tray } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { setIsAppQuitting, setIsUpdateAvailable } from '../main';
import { buildContextMenu } from '../utils/menu';

class AppUpdater {
    constructor() {
        autoUpdater.logger = log;
    }

    async checkForUpdate(tray: Tray, mainWindow: BrowserWindow) {
        await autoUpdater.checkForUpdatesAndNotify();
        autoUpdater.on('update-downloaded', () => {
            showUpdateDialog(mainWindow);
            setIsUpdateAvailable(true);
            tray.setContextMenu(buildContextMenu(mainWindow));
        });
    }

    updateAndRestart = () => {
        setIsAppQuitting(true);
        autoUpdater.quitAndInstall();
    };
}

export default new AppUpdater();

export const showUpdateDialog = (mainWindow: BrowserWindow): void => {
    mainWindow.webContents.send('show-update-dialog');

    // dialog
    //     .showMessageBox({
    //         type: 'info',
    //         title: 'Install update',
    //         message: 'Restart to update to the latest version of ente',
    //         buttons: ['Later', 'Restart now'],
    //     })
    //     .then((buttonIndex) => {
    //         if (buttonIndex.response === 1) {
    //             setIsAppQuitting(true);
    //             autoUpdater.quitAndInstall();
    //         }
    //     });
};
