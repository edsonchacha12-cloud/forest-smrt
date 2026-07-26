const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAddModulePathsToTranspile: ['react-native-maps'],
      },
    },
    argv
  );

  // Add alias for react-native-maps
  config.resolve.alias = {
    ...config.resolve.alias,
    'react-native-maps': require.resolve('./web-mocks/react-native-maps'),
  };

  return config;
};
