const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Tạo alias: khi import @react-native-community/datetimepicker → dùng gói mới
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  '@react-native-community/datetimepicker': path.resolve(
    __dirname,
    'node_modules/@react-native-datetimepicker/datetimepicker'
  ),
};

module.exports = config;
