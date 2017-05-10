/**
 * Created by Greg on 3/17/2017.
 */
module.exports = (grunt) => {
  grunt.registerTask('test', ['env:mock', 'clean:diskDb', 'run:server', 'mochaTest', 'stop:server']);
};
