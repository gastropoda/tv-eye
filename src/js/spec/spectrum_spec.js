define([
  "spectrum"
], function(Spectrum) {
  describe("Spectrum", function() {
    var pink;
    var green;
    var yellow;
    var inputColor;
    var shades;
    var discriminationTolerance;
    var calibrationTolerance;
    var spectrum;

    beforeEach(function() {
      pink = {};
      green = {};
      yellow = {};
      inputColor = {};
      shades = [pink, green, yellow];
      discriminationTolerance = 10;
      calibrationTolerance = 50;
      spectrum = new Spectrum({
        shades: shades,
        discriminationTolerance: discriminationTolerance,
        calibrationTolerance: calibrationTolerance
      });
    });

    describe("constructor", function() {
      it("assigns shades", function() {
        expect(spectrum.shades()).to.eql(shades);
      });

      it("assigns discrimination tolerance", function() {
        expect(spectrum.discriminationTolerance()).to.eql(discriminationTolerance);
      });

      it("assigns calibration tolerance", function() {
        expect(spectrum.calibrationTolerance()).to.eql(calibrationTolerance);
      });
    });

    describe(".classifyColor", function() {
      function testRecognizer(distances, expectedResult, calibrate) {
        $.each(shades, function(i, shade) {
          shade.distance = sinon.stub().returns(distances[i]);
        });
        expect(spectrum.classifyColor(inputColor, calibrate)).to.eq(expectedResult);
        $.each(shades, function(i, shade) {
          expect(shade.distance).to.have.been.calledWith(inputColor);
        });
      }

      describe("with calibrate == true", function() {
        it("is null if color outside calibrationTolerance", function() {
          testRecognizer([51, 51, 51], null, true);
        });
        it("calibrates the shade within calibrationTolerance", function() {
          testRecognizer([5, 51, 51], pink, true);
          testRecognizer([51, 5, 51], green, true);
          testRecognizer([51, 51, 5], yellow, true);
        });
        it("calibrates the closest shade if multiple candidates", function() {
          testRecognizer([5, 7, 51], pink, true);
          testRecognizer([7, 5, 51], green, true);
          testRecognizer([51, 7, 5], yellow, true);
        });
      });

      describe("with calibrate == false", function() {
        it("is null if color outside discriminationTolerance", function() {
          testRecognizer([11, 11, 11], null, false);
        });
        it("returns the shade within discriminationTolerance", function() {
          testRecognizer([5, 11, 11], pink, false);
          testRecognizer([11, 5, 11], green, false);
          testRecognizer([11, 11, 5], yellow, false);
        });
        it("returns the closest shade if multiple candidates", function() {
          testRecognizer([3, 5, 5], pink, false);
          testRecognizer([5, 3, 5], green, false);
          testRecognizer([5, 5, 3], yellow, false);
        });
      });
    });

  });
});
