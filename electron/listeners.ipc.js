const ipc = require('electron').ipcMain;
const Auth = require('./auth.handler');

class Listeners {
  window = null;

  static init(browserWindow) {
    this.window = browserWindow;

    this._initWindowListeners();
    this._initAuthListeners();
  }

  static _initWindowListeners() {
    this.window.on('maximize', this._onWindowChange.bind(this, true));
    this.window.on('unmaximize', this._onWindowChange.bind(this, false));
  }

  static _initAuthListeners() {
    ipc.on('google:get_token', this._onGetToken.bind(this));
  }

  static _onGetToken() {
    Auth.getToken()
      .then(this._emitToken.bind(this));
  }

  static _onWindowChange(isFullScreen) {
    this.window.webContents.send('window:change', isFullScreen);
  }

  static _emitToken(data) {
    this.window.webContents.send('google:sign_in', data);
  }
}

module.exports = Listeners;
