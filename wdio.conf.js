const path = require('path');
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
exports.config = {
  runner: 'local',
  port: 4723,

  specs: ['./__tests__/appium/specs/**/*.spec.js'],

  maxInstances: 1,

  capabilities: [{
    platformName: "Android",
    "appium:automationName": "UiAutomator2",
    "appium:deviceName": "emulator-5554",  // tên emulator của bạn
    "appium:platformVersion": "16",        // phiên bản Android
    "appium:appPackage": "host.exp.exponent", // Expo Go
    "appium:appActivity": ".MainActivity",
    "appium:noReset": true
  }],

  logLevel: "info",

  services: ['appium'],

  framework: 'mocha',

  mochaOpts: {
    ui: 'bdd',
    timeout: 600000
  },


  reporters: [
    'spec',
    [path.join(__dirname, './__tests__/reporters/csv.reporter.js'), {
      outputFile: `./test-result-${timestamp}.csv`

    }]
  ],


};
