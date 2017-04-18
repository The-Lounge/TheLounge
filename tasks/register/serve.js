/**
 * Created by Greg on 4/11/2016.
 */
module.exports = (grunt) => {
  // FIXME I don't think this is working correclty...
  grunt.registerTask('serve', 'Compile then start a connect web server', () => grunt.task.run([
      'clean:server',
      'build',
      'concurrent:server',
      'postcss:server',
      'watch',
    ]));
};
