module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // WE ARE PUTTING THIS LINE BACK IN:
    plugins: ['nativewind/babel'],
  };
};