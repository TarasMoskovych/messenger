const electronInstaller = require('electron-winstaller');

const settings = {
  appDirectory: './builds/messenger-win32-x64',
  outputDirectory: './builds',
  name: 'Messenger',
  setupIcon: './resources/icon.ico'
};

console.log('electron-winstaller:start');

electronInstaller.createWindowsInstaller(settings)
  .then(() => console.log('electron-winstaller:created'));
