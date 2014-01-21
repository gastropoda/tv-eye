define([
  "shade"
], function(Shade) {
  describe("Shade", function() {
    var colors = [{}, {}, {}];
    var shade = new Shade(colors[0], colors[1], colors[2]);
    var inputColor = {}

    describe("constructor", function() {
      it("assigns args to colors", function() {
        expect(shade.colors()).to.eql(colors);
      });

      it("configures thresholds", function() {

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
  });
});
