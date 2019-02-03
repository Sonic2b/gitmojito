import {app, BrowserWindow, ipcMain, Tray, Notification, clipboard, dialog} from 'electron'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import {enableLiveReload} from 'electron-compile'
import * as path from 'path'

const assetsDirectory = path.join(__dirname, 'assets')

let tray: Tray

const isDevMode = process.execPath.match(/[\\/]electron/)
if (isDevMode) {
    enableLiveReload()
}

let window: Electron.BrowserWindow | null

/**
 * ------------------ CREATE WINDOW -----------------------------
 */

const createWindow = async () => {

    createTray()
    window = new BrowserWindow({ width: 300,
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
        window.setAlwaysOnTop(true, 'floating')
        window.setVisibleOnAllWorkspaces(true)
        window.setFullScreenable(false)

    window.loadURL(`file://${__dirname}/index.jade`)
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

/**
 * ------------- TRAY CREATION ----------------------------
 */

const createTray = () => {
    tray = new Tray(path.join(assetsDirectory, 'gitmojito24.png'))
    tray.on('right-click', toggleWindow)
    tray.on('double-click', toggleWindow)
    tray.on('click', toggleWindow)
}

const toggleWindow = () => {
    if (window && window.isVisible()) {
      window.hide()
    } else {
      showWindow()
    }
  }

const showWindow = () => {
    const position = getWindowPosition()
    if (window) {
        window.setPosition(position.x, position.y, false)
        window.show()
        window.focus()
    }
}

const getWindowPosition = () => {
    const windowBounds = window ? window.getBounds() : null
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
  
/**
 * -------------- EVENTS -----------------
 */

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (window === null) {
        createWindow()
    }
})

ipcMain.on('show-window', () => {
    showWindow()
  })

  // @ts-ignore
  ipcMain.on('copy', (event, args) => {
      // tslint:disable-next-line:no-unused-expression
      new Notification({
          title: `${args.code} - ${args.emoji}`,
          body: `${args.name}  was copied in clipboard`
      }).show()
      clipboard.writeText(args.code)
      if (window) {
          window.hide()
      }
  })
  
  // @ts-ignore
  ipcMain.on('fetch-error', (event, args) => {
      dialog.showErrorBox('Error', `Impossible to get the emojie list ${args.message}`)
  })
