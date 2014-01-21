define([
  "spectrum"
], function(Spectrum) {
  describe("Spectrum", function() {
    var pink;
    var green;
    var yellow;
    var inputColor;
    var shades;
    var shadeTolerance;
    var spectrum;

    beforeEach(function() {
      pink = {};
      green = {};
      yellow = {};
      inputColor = {};
      shades = [pink, green, yellow];
      shadeTolerance = 50;
      spectrum = new Spectrum({shades: shades, shadeTolerance: shadeTolerance});
    });

    describe("constructor", function() {
      it("assigns shades", function() {
        expect(spectrum.shades).to.eql(shades);
      });

      it("assigns shade tolerance", function() {
        expect(spectrum.shadeTolerance).to.eql(shadeTolerance);
      });
    });

    describe("recognize shade", function() {
      function testRecognizer( distances, expectedResult) {
        $.each(shades,function(i, shade) {
          shade.distance = sinon.stub().returns( distances[i] );
        });
        expect(spectrum.recognizeShade(inputColor)).to.eq(expectedResult);
        $.each(shades,function(i, shade) {
          expect(shade.distance).to.have.been.calledWith(inputColor);
        });
      }

      it("returns null if input is too far from any shade", function() {
        testRecognizer([51,151,251], null);
      });
      it("returns the shade within shade tolerance", function() {
        testRecognizer([50,151,251], pink);
        testRecognizer([150,30,251], green);
        testRecognizer([150,151,25], yellow);
      });
      it("returns the closes shade if multiple candidates", function() {
        testRecognizer([5,30,151], pink);
        testRecognizer([50,30,51], green);
        testRecognizer([50,30,5], yellow);
      });
    });
  });
});
