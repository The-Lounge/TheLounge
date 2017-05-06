/**
 * @author Greg Rozmarynowycz <greg@thunderlab.net>
 */
module.exports = (grunt) => {
  grunt.config.set('wait', {
    build: {
      options: {
        delay: 12000,
      },
    },
  });

  grunt.loadNpmTasks('grunt-wait');
};
