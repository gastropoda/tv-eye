module.exports = function(config) {
  config.set({
    basePath: "",
    // requirejs must be included before sinon-chai
    // so it can require chai
    frameworks: ["mocha", "requirejs", "sinon-chai"],
    files: [
      // make sure test setup is available to all tests
      // these files can't be anonymous AMD modules because
      // they are included with script tags, see
      // http://requirejs.org/docs/errors.html#mismatch
      "src/js/spec/support/*.js",
      "src/js/spec/specs.setup.js",
      { pattern: "bower_components/**/*.js", included: false },
      { pattern: "src/js/**/*.js", included: false },
      { pattern: "src/index.html", included: false, watched: false },
      { pattern: "src/css/*.css", included: false, watched: false },
      { pattern: "src/img/*.jpg", included: false, watched: false }
    ],
    exclude: [],
    // must disable html2js preprocessor to serve plain html
    preprocessors: { },
    reporters: ["progress"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    // run headless phantom by default
    // to attach more just go to http://thishost:9876/
    browsers: ["PhantomJS"],
    captureTimeout: 20000, // ms
    singleRun: false
  });
};
