import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import * as fs from 'fs'
import PDFMerger from 'pdf-merger-js'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      nodeIntegration: true
    }
  })

  ipcMain.on('print', () => {
    const path = getPath() + 'print.pdf'
    mainWindow.webContents
      .printToPDF({
        landscape: true,
        pageSize: 'A4',
        printBackground: true
      })
      .then((data) => {
        fs.writeFile(path, data, (error) => {
          if (error) return dialog.showErrorBox('Error', error.message)
          dialog.showMessageBox({
            type: 'info',
            message: 'Pdf created'
          })
          shell.openPath(path)
        })
      })
  })

  let pdfs: Buffer[] = []

  ipcMain.on('print-next', async (event) => {
    console.log('print-next')
    await mainWindow.webContents
      .printToPDF({
        landscape: true,
        pageSize: 'A4',
        printBackground: true
      })
      .then((data) => {
        pdfs.push(data)
      })
    event.reply('print-next')
  })

  ipcMain.on('print-all-end', async () => {
    const merger = new PDFMerger()
    for (const pdf of pdfs) {
      await merger.add(pdf)
    }
    const path = getPath()
    await merger
      .save(path + 'merged.pdf')
      .then(() => {
        dialog.showMessageBox({
          type: 'info',
          message: 'Pdf created in ' + path + 'merged.pdf'
        })
        shell.openPath(path + 'merged.pdf')
      })
      .catch((error) => {
        dialog.showErrorBox('Error', error.message)
      })
    pdfs = []
  })

  ipcMain.on('print-all', async (event) => {
    console.log('print-all')
    event.reply('print-next')
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.maximize()
    mainWindow.show()
    if (is.dev) mainWindow.webContents.openDevTools()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

function getPath() {
  return process.env.PORTABLE_EXECUTABLE_DIR ? process.env.PORTABLE_EXECUTABLE_DIR + '/db/' : 'db/'
}
