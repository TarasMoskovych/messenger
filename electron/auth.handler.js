const electronGoogleOauth = require( 'electron-google-oauth');
const authConfig = require('./auth.config');

class Auth {

  static getToken() {
    return electronGoogleOauth(this._getWindowProps()).getAccessToken(...authConfig);
  }

  static _getWindowProps() {
    return {
      'use-content-size': true,
      center: true,
      show: true,
      resizable: false,
      'always-on-top': true,
      'standard-window': true,
      'auto-hide-menu-bar': true,
      'node-integration': false
    }
  }
}

module.exports = Auth;
