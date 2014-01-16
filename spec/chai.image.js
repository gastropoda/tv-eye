define(["chai"], function(chai) {
  var Assertion = chai.Assertion;

  Assertion.addMethod("pixels", function(pixels) {
    var image = this._obj;
    var rgba = image.data;
    var w = image.width;
    var h = image.height;
    var diff = [];
    for (var y = 0; y < w; y++) {
      for (var x = 0; x < h; x++) {
        var actualPixel = {
          r: rgba[(x + y * w) * 4],
          g: rgba[(x + y * w) * 4 + 1],
          b: rgba[(x + y * w) * 4 + 2],
          a: rgba[(x + y * w) * 4 + 3],
        };
        var expectedPixel = pixels(x, y);
        if (actualPixel.r != expectedPixel.r ||
          actualPixel.g != expectedPixel.g ||
          actualPixel.b != expectedPixel.b ||
          actualPixel.a != expectedPixel.a) {
          diff.push({
            at: [x, y],
            actual: actualPixel,
            expected: expectedPixel,
          });
        }
      }
    }

    var diffText = JSON.stringify(diff).replace(/^(.{250}).*/, "$1...]");
    new Assertion(diffText, "pixels differ").to.be.eq("[]");
  });

});