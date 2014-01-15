require.config({
  baseUrl: "/js/",
  paths: {
    ghoul: "/vendor/grunt-ghoul/lib/ghoul",
    mocha: "/vendor/mocha/mocha",
    chai: "/vendor/chai/chai"
  }
});

var expect;

require(["ghoul", "mocha", "chai"], function(ghoul) {
  mocha.setup("bdd");
  expect = require('chai').expect;

  require([
    "spec/all.specs",
    ], function() {
    mocha.run(function() {
      ghoul.emit("done", document.getElementById("mocha").innerHTML);
    });
  });

});

