/**
 * Created by Greg on 3/17/2017.
 */
module.exports = function (grunt) {
  grunt.config.set('mochaTest', {
    'api-test': {
      options: {
        reporter: 'spec',
        quiet: false,
        delay: true,
        timeout: 3000, // running things concurrently is apparently slow??
      },
      src: ['test/api-int/**/*.js','test/api-spec/**/*.js'],
    }
  });

  grunt.loadNpmTasks('grunt-mocha-test');
};
