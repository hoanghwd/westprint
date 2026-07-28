const proxy = require('http-proxy-middleware');

// Local dev only: proxies API calls through the CRA dev server so the
// browser sees same-origin requests to localhost:3000 instead of making
// cross-origin calls to dev.huynhdous.com (which has no CORS headers on
// the actual routed controllers and gets blocked as "Network Error").
module.exports = function (app) {
  app.use(
    proxy(['/webPortal', '/westPrintApi', '/public'], {
      target: 'https://dev.huynhdous.com',
      changeOrigin: true,
      secure: false,
    })
  );
};
