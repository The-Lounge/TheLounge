/**
 * Created by Greg on 3/17/2017.
 */
module.exports = function(grunt) {
  grunt.registerTask('test', ['run:server', 'mochaTest', 'stop:server'])
};
