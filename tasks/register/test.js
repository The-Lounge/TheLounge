/**
 * Created by Greg on 3/17/2017.
 */
module.exports = function(grunt) {
  grunt.registerTask('test', ['env:mock', 'clean:dev','run:server', 'mochaTest', 'stop:server']);
};
