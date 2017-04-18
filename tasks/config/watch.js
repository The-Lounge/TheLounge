/**
 * `watch`
 *
 * ---------------------------------------------------------------
 *
 * Run predefined tasks whenever watched file patterns are added, changed or deleted.
 *
 * Watch for changes on:
 * - files in the `assets` folder
 * - the `tasks/pipeline.js` file
 * and re-run the appropriate tasks.
 *
 * For usage docs see:
 *   https://github.com/gruntjs/grunt-contrib-watch
 *
 */
module.exports = (grunt) => {
  grunt.config.set('watch', {
    api: {
      files: ['api/**/*', '!**/node_modules/**'],
    },
    assets: {

      // Assets to watch:
      files: ['ng/**/*', 'index.html', '!**/node_modules/**'],

      // When assets are changed:
      tasks: ['build', 'syncAssets'],
    },
    js: {
      files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
      tasks: ['newer:eslint', 'build', 'syncAssets'/* , 'newer:jscs:all'*/],
    },
    jsTest: {
      files: ['test/ui-spec/{,*/}*.js'],
      tasks: ['newer:eslint:test', 'karma'],
    },
    compass: {
      files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
      tasks: ['compass:server', 'postcss:server'],
    },
    gruntfile: {
      files: ['Gruntfile.js'],
    },
    options: {
      livereload: true,
    },
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
};
