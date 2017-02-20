/**
 * Created by Greg on 4/11/2016.
 */
module.exports = function (grunt) {
  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'build',
      'concurrent:server',
      'postcss:server',
      'connect:livereload',
      'watch'
    ]);
  });
};
