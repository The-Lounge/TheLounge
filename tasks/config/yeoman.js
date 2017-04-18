const appConfig = {
  app: 'ng',
  dist: '.tmp/public',
};

module.exports = (grunt) => {
  grunt.config.set('yeoman', appConfig);
  return appConfig;
};

module.exports.app = appConfig;
