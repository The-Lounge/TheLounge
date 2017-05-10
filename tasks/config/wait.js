/**
 * @author Greg Rozmarynowycz <greg@thunderlab.net>
 */
module.exports = (grunt) => {
  grunt.config.set('wait', {
    build: {
      options: {
        delay: 0,
        after() {
          const dirTree = require('nodetree');
          dirTree('.tmp');
        },
      },
    },
  });

  grunt.loadNpmTasks('grunt-wait');
};
