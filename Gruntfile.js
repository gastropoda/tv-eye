module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    ghoul: {
      tests: {
        runner: 'mocha',
        urls: [ 'http://localhost:8080/src/test_runner.html' ],
        phantom: {}
      }
    }

  });

  grunt.loadNpmTasks('grunt-ghoul');
  grunt.registerTask('default', ['ghoul']);
};
