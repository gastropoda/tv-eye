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
    var spectrum;

    beforeEach(function() {
      pink = {};
      green = {};
      yellow = {};
      inputColor = {};
      shades = [pink, green, yellow];
      discriminationTolerance = 50;
      spectrum = new Spectrum({shades: shades, discriminationTolerance: discriminationTolerance});
    });

    describe("constructor", function() {
      it("assigns shades", function() {
        expect(spectrum.shades).to.eql(shades);
      });

      it("assigns shade tolerance", function() {
        expect(spectrum.discriminationTolerance).to.eql(discriminationTolerance);
      });
    });

    describe(".classifyColor", function() {
      function testRecognizer( distances, expectedResult, adopt) {
        $.each(shades,function(i, shade) {
          shade.distance = sinon.stub().returns( distances[i] );
        });
        if (adopt && expectedResult) {
          expectedResult.adopt = sinon.stub();
        }
        expect(spectrum.classifyColor(inputColor, adopt)).to.eq(expectedResult);
        $.each(shades,function(i, shade) {
          expect(shade.distance).to.have.been.calledWith(inputColor);
        });
        if (adopt && expectedResult) {
          expect(expectedResult.adopt).to.have.been.calledWith(inputColor);
        }
      }

      it("returns null if input is too far from any shade", function() {
        testRecognizer([51,151,251], null, true);
      });
      it("returns the shade within shade tolerance", function() {
        testRecognizer([50,151,251], pink, true);
        testRecognizer([150,30,251], green, true);
        testRecognizer([150,151,25], yellow, true);
      });
      it("returns the closes shade if multiple candidates", function() {
        testRecognizer([5,30,151], pink, true);
        testRecognizer([50,30,51], green, true);
        testRecognizer([50,30,5], yellow, true);
      });
    });

  });
});
