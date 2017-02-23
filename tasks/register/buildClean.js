/**
 * Created by Greg on 4/12/2016.
 */
module.exports = function(grunt) {

  grunt.log.write("Running Build Task");

  grunt.registerTask('build', [
    'compileAssets',
    'linkAssetsBuild',
    'clean:build',
    //From Yeoman
    'clean:dist',
    'browserify:dev',
    //'useminPrepare',
    //'concurrent:dist',
    //'postcss',
    //'ngtemplates',
    //'concat',
    //'ngAnnotate',
    //'cdnify',
    //'cssmin',
    //'uglify',
    //'filerev',
    //'usemin',
    //'htmlmin'
    'copy:dev'
  ]);
};
