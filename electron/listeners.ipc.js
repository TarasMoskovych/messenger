const ipc = require('electron').ipcMain;
const log = require('electron-log');

class Listeners {
  window = null;

  static init(browserWindow) {
    this.window = browserWindow;

    this._initWindowState();
    this._initFrameListeners();
  }

  static _initWindowState() {
    this.window.webContents.once('dom-ready', this._emitWindowState.bind(this));
  }

  static _initFrameListeners() {
    ipc.on('frame:actions', (event, obj) => {
      switch (obj.type) {
        case 'minimize':
          this.window.minimize();
          break;
        case 'maximize':
          this.window.setFullScreen(!this.window.isFullScreen());
          break;
        case 'close':
          this.window.close();
          break;
        default:
          log.error('Not supported frame action type.');
      }
    });
  }

  static _emitWindowState() {
    this.window.webContents.send('window:state', this.window.isFullScreen());
  }
}

module.exports = Listeners;
