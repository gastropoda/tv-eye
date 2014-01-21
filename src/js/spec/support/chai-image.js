(function() {
  var Assertion = chai.Assertion;

  Assertion.addMethod("pixels", function(pixels) {
    var image = this._obj;
    var rgba = image.data;
    var w = image.width;
    var h = image.height;
    var diff = [];
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var actualPixel = {
          red: rgba[(x + y * w) * 4],
          green: rgba[(x + y * w) * 4 + 1],
          blue: rgba[(x + y * w) * 4 + 2],
          alpha: rgba[(x + y * w) * 4 + 3],
        };
        var expectedPixel = pixels(x, y);
        if (actualPixel.red !== expectedPixel.red ||
          actualPixel.green !== expectedPixel.green ||
          actualPixel.blue !== expectedPixel.blue ||
          actualPixel.alpha !== expectedPixel.alpha) {
          diff.push({
            at: [x, y],
            expected: expectedPixel,
            actual: actualPixel,
          });
        }
      }
    }

    var diffText = JSON.stringify(diff).replace(/^(.{250}).*/, "$1...]");
    new Assertion(diffText, "pixels differ").to.be.eq("[]");
  });

  Assertion.overwriteMethod("equal", function(_super) {
    return function assertEquals(other) {
      var obj = this._obj;
      if (obj.equals instanceof Function) {
        this.assert(obj.equals(other),
          "expected #{act} to equal #{exp}",
          "expected #{act} not to equal #{exp}",
          other.toString(),
          obj.toString());
      }
      else {
        _super.apply(this, arguments);
      }
    };
  });
})();
