require.config({
  baseUrl: "/src/",
  paths: {
    ghoul: "/vendor/grunt-ghoul/lib/ghoul",
    mocha: "/vendor/mocha/mocha",
    chai: "/vendor/chai/chai"
  }
});

require(["ghoul", "mocha", "chai"], function(ghoul) {
  mocha.setup("bdd");

  require(["js/spec/demo_spec.js"], function() {
    mocha.run(function() {
      ghoul.emit("done", document.getElementById("mocha").innerHTML);
    });
  });

});

