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
    api:  {
      options: {},
      src: [
        'Gruntfile.js',
        'tasks/**/*.js',
        'api/**/*.js',
      ],
    },
    ui: {
      options: {},
      src: ['ng/**/*.js', '!ng/js/dependencies/**/*.js', '!ng/dist/**/*.js'],
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
