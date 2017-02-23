/**
 * Created by Greg on 4/11/2016.
 */
module.exports = function(grunt){
  grunt.config.set('concurrent', {
    server: [
      'compass:server'
    ],
    test: [
      'compass'
    ],
    dist: [
      'compass:dist',
      'imagemin',
      'svgmin'
    ]
  });

  grunt.loadNpmTasks('grunt-concurrent');
};
