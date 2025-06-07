module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [{
        // "moduleName": "@env",
        // "path": ".env",
        // "blocklist": null,  // This was 'blacklist' in older versions
        // "allowlist": null,  // This was 'whitelist' in older versions
        // "safe": false,
        // "allowUndefined": true
      }]
    ]
  };
};