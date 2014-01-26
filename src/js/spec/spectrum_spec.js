define([
  "spectrum"
], function(Spectrum) {
  describe("Spectrum", function() {
    var pink;
    var green;
    var yellow;
    var inputColor;
    var shades;
    var spectrum;

    beforeEach(function() {
      pink = {};
      green = {};
      yellow = {};
      inputColor = {};
      shades = [pink, green, yellow];
      spectrum = new Spectrum({ shades: shades });
    });

    describe("constructor", function() {
      it("assigns shades", function() {
        expect(spectrum.shades()).to.eql(shades);
      });
    });

    describe(".classifyColor", function() {
      var tolerance = 50;

      function testRecognizer(distances, expectedResult) {
        $.each(shades, function(i, shade) {
          shade.distance = sinon.stub().returns(distances[i]);
        });
        expect(spectrum.classifyColor(inputColor, tolerance)).to.eq(expectedResult);
        $.each(shades, function(i, shade) {
          expect(shade.distance).to.have.been.calledWith(inputColor);
        });
      }

      it("is null if color outside tolerance", function() {
        testRecognizer([51, 51, 51], null);
      });
      it("calibrates the shade within tolerance", function() {
        testRecognizer([5, 51, 51], pink);
        testRecognizer([51, 5, 51], green);
        testRecognizer([51, 51, 5], yellow);
      });
      it("calibrates the closest shade if multiple candidates", function() {
        testRecognizer([5, 7, 51], pink);
        testRecognizer([7, 5, 51], green);
        testRecognizer([51, 7, 5], yellow);
      });
    });
  });
});
