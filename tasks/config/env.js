/**
 * @author Greg Rozmarynowycz <greg@thunderlab.net>
 */

module.exports = (grunt) => {
  grunt.config.set('env', {
    options: {
      // NODE_ENV: grunt.option('environment') || 'development',
    },
    mock: {
      NODE_ENV: 'mock',
    },
  });

  grunt.loadNpmTasks('grunt-env');
};
