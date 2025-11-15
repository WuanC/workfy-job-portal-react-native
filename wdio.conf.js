exports.config = {
  // ====================
  // Runner Configuration
  // ====================
  runner: 'local',
  port: 4723,
  
  // ==================
  // Specify Test Files
  // ==================
  specs: [
    './__tests__/appium/specs/**/*.spec.js'
  ],
  
  // ============
  // Capabilities
  // ============
  capabilities: [{
    platformName: 'Android',
    'appium:deviceName': 'emulator-5554', // Thay đổi theo tên device của bạn
    'appium:platformVersion': '14', // Thay đổi theo Android version
    'appium:automationName': 'UiAutomator2',
    // Đường dẫn đến APK file (cập nhật sau khi download từ EAS)
    'appium:app': 'F:\\PBL\\workify-job-portal-react-native\\app-debug.apk',
    'appium:appPackage': 'com.bo11082007.workifyJobPortalReactNative',
    'appium:appActivity': '.MainActivity',
    'appium:noReset': false,
    'appium:fullReset': false,
    'appium:newCommandTimeout': 240,
    'appium:autoGrantPermissions': true,
  }],
  
  // ===================
  // Test Configurations
  // ===================
  logLevel: 'info',
  bail: 0,
  baseUrl: 'http://localhost',
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  
  services: [
    ['appium', {
      command: 'appium',
      args: {
        relaxedSecurity: true,
        address: 'localhost',
        port: 4723,
        logLevel: 'info'
      }
    }]
  ],
  
  framework: 'mocha',
  reporters: ['spec'],
  
  mochaOpts: {
    ui: 'bdd',
    timeout: 120000
  },
  
  // =====
  // Hooks
  // =====
  before: function (capabilities, specs) {
    // Khởi tạo trước khi chạy test
  },
  
  afterTest: async function(test, context, { error, result, duration, passed, retries }) {
    if (error) {
      await driver.takeScreenshot();
    }
  },
}
