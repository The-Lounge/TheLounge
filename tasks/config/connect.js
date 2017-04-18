/**
 * Created by Greg on 4/2/2016.
 */
module.exports = (grunt) => {
  const yeoman = require('./yeoman');
  const serveStatic = require('serve-static');

  grunt.config.set('connect', {
    options: {
      port: 9000,
      // Change this to '0.0.0.0' to access the server from outside.
      hostname: 'localhost',
      livereload: 35729,
    },
    livereload: {
      options: {
        open: true,
        middleware(connect) {
          return [
            serveStatic('.tmp'),
            connect().use(
               '/app/styles',
               serveStatic('./app/styles')),
            serveStatic(yeoman.app.app),
          ];
        },
      },
    },
    test: {
      options: {
        port: 9001,
        middleware() {
          return [
            serveStatic('.tmp'),
            serveStatic('test'),
            serveStatic(yeoman.app.app),
          ];
        },
      },
    },
    dist: {
      options: {
        open: true,
        base: '<%= yeoman.dist %>',
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
};
