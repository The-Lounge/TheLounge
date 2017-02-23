/**
 * Created by Greg on 4/11/2016.
 */
module.exports = function (grunt) {
  grunt.config.set('karma', {
    unit: {
      configFile: 'test/karma.conf.js',
      singleRun: true
    }
  });
};
