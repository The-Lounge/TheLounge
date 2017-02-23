var appConfig = {
  app: 'ng',
  dist: '.tmp/public'
};

module.exports = function(grunt){
  grunt.config.set('yeoman', appConfig);

  return appConfig;
};

module.exports.app = appConfig;
