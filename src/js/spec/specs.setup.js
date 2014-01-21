(function() {

  requirejs.config({
    baseUrl: "/base/js",

    paths: {
      jquery: "lib/jquery-2.0.3.min",
      knockout: "lib/knockout-3.0.0",
      paper: "lib/paper-full-0.9.15"
    },

    shims: {
      "paper": {
        exports: "paper"
      }
    },

    deps: collectSpecFiles(),

    callback: window.__karma__.start
  });

  function collectSpecFiles() {
    var specFiles = [];
    for (var file in window.__karma__.files) {
      if (window.__karma__.files.hasOwnProperty(file)) {
        if (/.*\/js\/spec\/.+_spec\.js$/.test(file)) {
          specFiles.push(file);
        }
      }
    }
    return specFiles;
  }
})();
