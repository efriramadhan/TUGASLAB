const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs'];

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  'react-native': __dirname + '/node_modules/react-native',
  'react': __dirname + '/node_modules/react',
  '@babel': __dirname + '/node_modules/@babel',
};

config.resolver.blockList = [
  /.*\/node_modules\/.*\/node_modules\/react-native\/.*/,
];

module.exports = config;