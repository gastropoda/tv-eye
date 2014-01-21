define([
  "spectrum"
], function(Spectrum) {
  describe("Spectrum", function() {
    var pink = {};
    var green = {};
    var yellow = {};
    var shades = [pink, green, yellow];
    var spectrum = new Spectrum({shades: shades});

    describe("constructor", function() {
      it("assigns shades", function() {
        expect(spectrum.shades).to.eql(shades);
      });
    });
  });
});
