/**
 * Created by Greg on 4/2/2016.
 */
module.exports = function(grunt){

  var yeoman = require('./yeoman'),
    serveStatic = require('serve-static');

  grunt.config.set('connect', {
    options: {
      port: 9000,
      // Change this to '0.0.0.0' to access the server from outside.
      hostname: 'localhost',
      livereload: 35729
    },
    livereload: {
      options: {
        open: true,
        middleware: function (connect) {
          return [
            serveStatic('.tmp'),
            connect().use(
              '/app/styles',
              serveStatic('./app/styles')
            ),
            serveStatic(yeoman.app.app)
          ];
        }
      }
    },
    test: {
      options: {
        port: 9001,
        middleware: function (connect) {
          return [
            serveStatic('.tmp'),
            serveStatic('test'),
            serveStatic(yeoman.app.app)
          ];
        }
      }
    },
    dist: {
      options: {
        open: true,
        base: '<%= yeoman.dist %>'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
};
