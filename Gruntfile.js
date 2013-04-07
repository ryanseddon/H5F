/*global module:false*/
module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    qunit: {
      files: ['test/**/*.html']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint qunit'
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        'src/{,*/}*.js',
        'test/{,*/}*.js'
      ]
    },
    uglify: {
      options: {
        stripbanners: true,
        banner: '<%= banner%>',
        mangle: {
          except: ['H5F']
        },
        preserveComments: 'some'
      },
      dist: {
        src: [
          'src/H5F.js'
        ],
        dest: 'h5f.min.js'
      }
    }
  });

  // Load required contrib packages
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Default task.
  grunt.registerTask('default', ['jshint', 'qunit', 'uglify']);
  
  // Travis CI task.
  grunt.registerTask('travis', ['jshint', 'qunit']);

};
