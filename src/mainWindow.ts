import {app, BrowserWindow } from 'electron'

export class MainWindow {

    public static window: Electron.BrowserWindow

    constructor() {

        MainWindow.window = new BrowserWindow({ width: 300,
            height: 450,
            show: false,
            frame: false,
            fullscreenable: false,
            resizable: false,
            transparent: true,
            backgroundColor: "FFFFFF30",
            webPreferences: {
              // Prevents renderer process code from not running when window is
              // hidden
              backgroundThrottling: false
            }})

            app.dock.hide()
            MainWindow.window.setAlwaysOnTop(true, 'floating')
            MainWindow.window.setVisibleOnAllWorkspaces(true)
            MainWindow.window.setFullScreenable(false)

            app.on('activate', () => {
                // On macOS it's common to re-create a window in the app when the
                // dock icon is clicked and there are no other windows open.
                if (MainWindow.window === null) {
                    this.createWindow()
                }
            })

            MainWindow.window.loadURL(`file://${__dirname}/index.jade`)
            if (isDevMode) {
                await installExtension(VUEJS_DEVTOOLS)
                window.webContents.openDevTools({mode: 'detach'})
            }

            window.on('blur', () => {
                if (window && !window.webContents.isDevToolsOpened()) {
                window.hide()
                }
            })

            window.on('closed', () => {
                window = null
            })
    }

    public toggleWindow() {
        if (MainWindow.window && MainWindow.window.isVisible()) {
          MainWindow.window.hide()
        } else {
          this.showWindow()
        }
      }

    public showWindow() {
        const position = this.getWindowPosition()
        if (MainWindow.window) {
            MainWindow.window.setPosition(position.x, position.y, false)
            MainWindow.window.show()
            MainWindow.window.focus()
        }
    }

    public getWindowPosition() {
        const windowBounds = MainWindow.window ? MainWindow.window.getBounds() : null
        const trayBounds = tray.getBounds()
        // Center window horizontally below the tray icon
        if (windowBounds) {
            const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2))
            // Position window 4 pixels vertically below the tray icon
            const y = Math.round(trayBounds.y + trayBounds.height + 4)
            return {x, y}
        }
        return {x: 0, y: 0}
      }

}
