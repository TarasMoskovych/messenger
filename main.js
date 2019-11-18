const { app, BrowserWindow } = require('electron');
const log = require('electron-log');
const url = require('url');
const path = require('path');
const Listeners = require('./electron/listeners.ipc');

let window = null;

function createWindow() {
  log.info('Create window');

  window = new BrowserWindow({
    width: 800,
    height: 600,
    // fullscreen: true,
    frame: false,
    resizable: true,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  window.loadURL(
    url.format({
      pathname: path.join(__dirname, 'dist/messenger/index.html'),
      protocol: 'file:',
      slashes: true,
    })
  );

  // window.webContents.openDevTools();

  // Init custom listeners
  Listeners.init(window);

  // Emitted when the window is closed.
  window.on('closed', () => window = null);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') { app.quit(); }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (!window) { createWindow(); }
});

process.on('uncaughtException', error => log.error(error));
