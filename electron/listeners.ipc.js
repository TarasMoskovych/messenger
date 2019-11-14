const ipc = require('electron').ipcMain;
const log = require('electron-log');

class Listeners {
  window = null;

  static init(browserWindow) {
    this.window = browserWindow;

    this._initWindowListeners();
  }

  static _initWindowListeners() {
    this.window.on('maximize', this._onWindowChange.bind(this, true));
    this.window.on('unmaximize', this._onWindowChange.bind(this, false));
  }

  static _onWindowChange(isFullScreen) {
    this.window.webContents.send('window:change', isFullScreen);
  }
}

module.exports = Listeners;
