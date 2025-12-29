'use strict';

const Homey = require('homey');

class SmartmiApp extends Homey.App {
  /**
   * onInit is called when the app is initialized.
   */
  async onInit() {
    this.log('Smartmi Air Purifier app has been initialized');
  }
}

module.exports = SmartmiApp;
