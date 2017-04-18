/**
 * Created by Greg on 3/17/2017.
 */
module.exports = (grunt) => {
  grunt.config.set('run', {
    server: {
      options: {wait: false},
      args: ['./app.js'],
    },
  });

  grunt.loadNpmTasks('grunt-run');
};
