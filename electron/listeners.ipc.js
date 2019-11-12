const ipc = require('electron').ipcMain;
const log = require('electron-log');

class Listeners {
  window = null;

  static init(browserWindow) {
    this.window = browserWindow;

    this._initFrameListeners();
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

}

module.exports = Listeners;
