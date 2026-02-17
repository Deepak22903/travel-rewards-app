const { getDefaultConfig } = require('expo/metro-config');
const defaultConfig = getDefaultConfig(__dirname);
defaultConfig.resolver.extraNodeModules = {
  events: require.resolve('events'),
  // keep any other aliases here
};
module.exports = defaultConfig;
