const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add web mock for react-native-maps
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  'react-native-maps': require.resolve('./web-mocks/react-native-maps'),
};

module.exports = config;
