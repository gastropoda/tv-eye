require(["/base/js/common-require-settings.js"], function() {

  require.config({
    baseUrl: "/base/js",
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
});
