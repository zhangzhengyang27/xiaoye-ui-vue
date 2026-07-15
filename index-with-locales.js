const xiaoyeUI = require('./components');

const req = require.context('./components', true, /^\.\/locale\/.+_.+\.tsx?$/);

xiaoyeUI.locales = {};

req.keys().forEach(mod => {
  const matches = mod.match(/\/([^/]+).tsx?$/);
  xiaoyeUI.locales[matches[1]] = req(mod).default;
});

module.exports = xiaoyeUI;
