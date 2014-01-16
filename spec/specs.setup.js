require.config({
  baseUrl: "/js/",
  paths: {
    // libraries
    jquery: 'lib/jquery-2.0.3.min',
    // testing
    ghoul: "/vendor/grunt-ghoul/lib/ghoul",
    mocha: "/vendor/mocha/mocha",
    chai: "/vendor/chai/chai"
  }
});

require(["jquery", "ghoul", "chai", "mocha"
], function($, ghoul, chai) {
  mocha.setup("bdd");
  window.expect = require('chai').expect;

  require([
    "spec/all.specs",
  ], function() {
    mocha.run(function() {
      var output = $("#mocha").clone();
      output.find("code").remove();
      ghoul.emit("done", output.html());
    });
  });

});
