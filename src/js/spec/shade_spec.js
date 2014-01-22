define([
  "shade"
], function(Shade) {
  describe("Shade", function() {
    var colors, shade, inputColor;

    beforeEach(function() {
      colors = [{}, {}, {}];
      shade = new Shade({
        colors: colors,
      });
      inputColor = {};
    });

    describe("constructor", function() {
      it("assigns colors", function() {
        expect(shade.colors()).to.eql(colors);
      });
    });

    describe(".distance()", function() {
      it("returns the minimum distance from input color to own colors", function() {
        colors[0].distance = sinon.stub().returns(10);
        colors[1].distance = sinon.stub().returns(20);
        colors[2].distance = sinon.stub().returns(30);
        expect(shade.distance(inputColor)).to.eq(10);
        expect(colors[0].distance).to.have.been.calledWith(inputColor);
        expect(colors[1].distance).to.have.been.calledWith(inputColor);
        expect(colors[2].distance).to.have.been.calledWith(inputColor);
      });

      it("empty shade returns Infinity", function() {
        expect(new Shade().distance(inputColor)).to.eq(Infinity);
      });
    });

    describe(".calibrate()", function() {
      it("adds a color to the shade", function() {
        var shade = new Shade();
        expect(shade.colors()).to.be.empty;
        shade.calibrate(colors[0]);
        expect(shade.colors()).to.include(colors[0]);
        shade.calibrate(colors[1]);
        expect(shade.colors()).to.include(colors[0]);
        expect(shade.colors()).to.include(colors[1]);
      });
    });

  });
});
