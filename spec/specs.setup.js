require.config({
  baseUrl: "/js/",
  paths: {
    // libraries
    jquery: 'lib/jquery-2.0.3.min',
    knockout: 'lib/knockout-3.0.0',
    // testing
    ghoul: "/vendor/grunt-ghoul/lib/ghoul",
    mocha: "/vendor/mocha/mocha",
    chai: "/vendor/chai/chai",
    sinon: "/vendor/sinon/pkg/sinon",
    "sinon-chai": "/vendor/sinon-chai/lib/sinon-chai",
  }
});

require(["jquery", "ghoul", "chai", "sinon-chai", "mocha", "sinon"
], function($, ghoul, chai, sinonChai) {
  chai.use(sinonChai);
  mocha.setup("bdd");
  window.expect = require('chai').expect;

  require([
    "spec/chai.image",
    "spec/all.specs",
  ], function() {
    mocha.run(function() {
      var output = $("#mocha").clone();
      output.find("code").remove();
      ghoul.emit("done", output.html());
    });
  });

});
