/**
 * Created by Greg on 4/11/2016.
 */
module.exports = (grunt) => {
  grunt.config.set('eslint', {
    options: {
      // ignores: [
      //   'node_modules/**/*.js',
      //   'bower_components/**/*.js',
      //   'ng/scripts/dependencies/sails.io.js',
      // ],
    },
    all: {
      src: [
        '/Gruntfile.js',
        '<%= yeoman.app %>/scripts/{,*/}*.js',
      ],
    },
    server:  {
      options: {},
      src: [
        'Gruntfile.js',
        'api/**/*.js',
      ],
    },
    test: {
      // options: {
      //   configFile: 'test/.eslintrc',
      // },
      // src: ['test/ui-spec/{,*/}*.js'],
    },
  });

  grunt.loadNpmTasks('grunt-eslint');
};
