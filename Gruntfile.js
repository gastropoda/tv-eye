module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    ghoul: {
      tests: {
        runner: "mocha",
        urls: ["http://localhost:8080/test_runner.html"],
        phantom: {}
      }
    },

    watch: {
      jsFiles: {
        files: ["**/*.js"],
        tasks: ["ghoul"]
      }
    },

    connect: {
      server: {
        options: {
          port: 8080,
          base: 'src',
        }
      }
    }

  });

  grunt.loadNpmTasks("grunt-ghoul");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-connect");
  grunt.registerTask("default", ["connect", "watch"]);
};
