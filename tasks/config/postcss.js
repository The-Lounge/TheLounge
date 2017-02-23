/**
 * Created by Greg on 4/11/2016.
 */
module.exports = function(grunt){
  grunt.config.set('postcss', {options: {
    processors: [
      require('autoprefixer')({browsers: ['last 1 version']})
    ]
  },
    server: {
      options: {
        map: true
      },
      files: [{
        expand: true,
        cwd: '.tmp/styles/',
        src: '{,*/}*.css',
        dest: '.tmp/styles/'
      }]
    },
    dist: {
      files: [{
        expand: true,
        cwd: '.tmp/styles/',
        src: '{,*/}*.css',
        dest: '.tmp/styles/'
      }]
    }});

  grunt.loadNpmTasks('grunt-postcss');
};
