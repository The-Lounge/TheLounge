/**
 * Created by Greg on 4/11/2016.
 */
module.exports = function(grunt) {
  grunt.config.set('compass', {
      options: {
        sassDir: '<%= yeoman.app %>/styles',
        cssDir: 'app/.tmp/styles',
        generatedImagesDir: 'app/.tmp/images/generated',
        imagesDir: '<%= yeoman.app %>/images',
        javascriptsDir: '<%= yeoman.app %>/scripts',
        fontsDir: '<%= yeoman.app %>/styles/fonts',
        importPath: './node_modules/',
        httpImagesPath: '/images',
        httpGeneratedImagesPath: '/images/generated',
        httpFontsPath: '/styles/fonts',
        relativeAssets: false,
        assetCacheBuster: false,
        raw: 'Sass::Script::Number.precision = 10\n'
      },
      dist: {
        options: {
          generatedImagesDir: '<%= yeoman.dist %>/images/generated'
        }
      },
      server: {
        options: {
          sourcemap: true
        }
      }
    });

  grunt.loadNpmTasks('grunt-contrib-compass');
};
