import Homey from 'homey';

class SmartmiApp extends Homey.App {
  /**
   * onInit is called when the app is initialized.
   */
  async onInit(): Promise<void> {
    this.log('Smartmi Air Purifier app has been initialized');
  }
}

module.exports = SmartmiApp;
