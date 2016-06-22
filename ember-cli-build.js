/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var fingerprintOptions = {
    enabled: true,
    generateRailsManifest: true,
    exclude: ['manifest.json']
  };
  var buildEnv = process.env.DEPLOY_TARGET || EmberApp.env();

  var isProductionLikeBuild = (env === 'production') || (env === 'staging') || (env == 'alpha');

  switch(buildEnv) {
    case 'development':
      fingerprintOptions.prepend = 'http://localhost:4200/';
      break;
    case 'alpha':
      fingerprintOptions.prepend = process.env['CF_ALPHA'];
      break;
    case 'staging':
      fingerprintOptions.prepend = process.env['CF_STAGING'];
      break;
    case 'production':
      fingerprintOptions.prepend = process.env['CF_PROD'];
      break;
  }

  var app = new EmberApp(defaults, {
    gzip: {
      appendSuffix: false
    },
    minifyCSS: { enabled: !!isProductionLikeBuild },
    minifyJS: { enabled: !!isProductionLikeBuild },
    fingerprint: fingerprintOptions,
    sourcemaps: {
      enabled: !isProductionLikeBuild
    },
    wrapInEval: !isProductionLikeBuild,
    tests: !isProductionLikeBuild,
    hinting: !isProductionLikeBuild,

    emberCLIDeploy: {
      runOnPostBuild: !isProductionLikeBuild ? 'development' : false, // returns the deployTarget
      configFile: 'config/deploy.js', // optionally specify a different config file
      shouldActivate: true, // optionally call the activate hook on deploy
    }
  });

  return app.toTree();
};
