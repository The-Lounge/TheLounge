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
module.exports = function(grunt) {

  grunt.config.set('watch', {
    api: {
      files: ['api/**/*', '!**/node_modules/**']
    },
    assets: {

      // Assets to watch:
      files: ['ng/**/*', 'index.html', 'tasks/pipeline.js', '!**/node_modules/**'],

      // When assets are changed:
      tasks: ['build', 'syncAssets' , 'linkAssets' ]
    },
    js: {
      files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
      tasks: ['newer:jshint:all','build','syncAssets'/*, 'newer:jscs:all'*/],
      options: {
        livereload: '<%= connect.options.livereload %>'
      }
    },
    jsTest: {
      files: ['test/ui-spec/{,*/}*.js'],
      tasks: ['newer:jshint:test', 'newer:jscs:test', 'karma']
    },
    compass: {
      files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
      tasks: ['compass:server', 'postcss:server']
    },
    gruntfile: {
      files: ['Gruntfile.js']
    },
    livereload: {
      options: {
        livereload: '<%= connect.options.livereload %>'
      },
      files: [
        '<%= yeoman.app %>/{,*/}*.html',
        '.tmp/styles/{,*/}*.css',
        '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
      ]
    },
    options: {
      livereload: true
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
};
