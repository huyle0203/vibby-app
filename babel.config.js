module.exports = function (api) {
  api.cache(true);
  const isProd = process.env.NODE_ENV === 'production';

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-iconify/plugin',
      'react-native-reanimated/plugin',
      isProd && ['transform-remove-console', { exclude: ['error', 'warn'] }],
    ].filter(Boolean),
  };
};