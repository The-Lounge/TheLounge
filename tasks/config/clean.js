/**
 * `clean`
 *
 * ---------------------------------------------------------------
 *
 * Remove the files and folders in your Sails app's web root
 * (conventionally a hidden directory called `.tmp/public`).
 *
 * For usage docs see:
 *   https://github.com/gruntjs/grunt-contrib-clean
 *
 */
module.exports = (grunt) => {
  grunt.config.set('clean', {
    diskDb: ['.tmp/localDiskDb.db'],
    dev: ['.tmp/public/**', '.tmp/localDiskDb.db'],
    build: ['www'],
    dist: {
      files: [{
        dot: true,
        src: [
          '.tmp',
          '<%= yeoman.dist %>/{,*/}*',
          '!<%= yeoman.dist %>/.git{,*/}*',
        ],
      }],
    },
    server: '.tmp',
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
};
