var env = process.env.APP_ENV || 'dev';

var config = {
  dev: require('./development.config'),
  prod: require('./production.config')
};

module.exports = config[env];
