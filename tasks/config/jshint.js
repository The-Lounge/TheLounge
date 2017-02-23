/**
 * Created by Greg on 4/11/2016.
 */
module.exports = function(grunt){
  grunt.config.set('jshint', {
    options: {
      jshintrc: '.jshintrc',
      reporter: require('jshint-stylish'),
      ignores: [
        'node_modules/**/*.js',
        'bower_components/**/*.js',
        'ng/scripts/dependencies/sails.io.js'
      ]
    },
    all: {
      src: [
        'Gruntfile.js',
        '<%= yeoman.app %>/scripts/{,*/}*.js'
      ]
    },
    test: {
      options: {
        jshintrc: 'test/.jshintrc'
      },
      src: ['test/ui-spec/{,*/}*.js']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
};
