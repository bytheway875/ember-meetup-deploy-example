var VALID_DEPLOY_TARGETS = [ //update these to match what you call your deployment targets
  'development',
  'alpha',
  'staging',
  'production'
];

module.exports = function(deployTarget) {
  var ENV = {
    build: {},
    redis: {
      allowOverwrite: true,
      keyPrefix: 'ember-meetup:index'
    },
    s3: {
      prefix: 'ember-meetup',
      accessKeyId: process.env.AWS_KEY,
      secretAccessKey: process.env.AWS_SECRET,
      bucket: process.env.AWS_BUCKET,
      region: process.env.AWS_REGION
    }
  };
  if (VALID_DEPLOY_TARGETS.indexOf(deployTarget) === -1) {
    throw new Error('Invalid deployTarget ' + deployTarget);
  }

  if (deployTarget === 'development') {
    ENV.build.environment = 'development';

    // The revision key is always __development__ now!!
    ENV.redis.revisionKey: '__development__',


    ENV.redis.url = process.env.REDIS_URL || 'redis://0.0.0.0:6379/';
    
    // Since we are deploying in development after build, the build plugin isnt necessary.
    ENV.plugins = ['redis']; // only care about deploying index.html into redis in dev
  }

  if (!deployTarget === 'development') {
    ENV.build.environment = 'production';

    ENV.redis.url = process.env.REDIS_URL;
  }

  return ENV;

  /* Note: a synchronous return is shown above, but ember-cli-deploy
   * does support returning a promise, in case you need to get any of
   * your configuration asynchronously. e.g.
   *
   *    var Promise = require('ember-cli/lib/ext/promise');
   *    return new Promise(function(resolve, reject){
   *      var exec = require('child_process').exec;
   *      var command = 'heroku config:get REDISTOGO_URL --app my-app-' + deployTarget;
   *      exec(command, function (error, stdout, stderr) {
   *        ENV.redis.url = stdout.replace(/\n/, '').replace(/\/\/redistogo:/, '//:');
   *        if (error) {
   *          reject(error);
   *        } else {
   *          resolve(ENV);
   *        }
   *      });
   *    });
   *
   */
}
