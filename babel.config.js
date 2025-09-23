module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Cho reanimated hoạt động (nếu bạn dùng modal kéo trượt)
      'react-native-reanimated/plugin',
    ],
  };
};
