/**
 * Created by Greg on 4/12/2016.
 */
module.exports = (grunt) => {
  grunt.registerTask('build', [
    'clean:build',
    'clean:dist',
    'less:dev',
    // From Yeoman
    'browserify:dev',
    // 'useminPrepare',
    // 'concurrent:dist',
    // 'postcss',
    // 'ngtemplates',
    // 'concat',
    // 'ngAnnotate',
    // 'cdnify',
    // 'cssmin',
    // 'uglify',
    // 'filerev',
    // 'usemin',
    // 'htmlmin'
    'copy:dev',
  ]);
};
