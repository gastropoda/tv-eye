define([
  "shade"
], function(Shade) {
  describe("Shade", function() {
    var colors, shade, inputColor;
    var defaults = {
      colors: [],
      maximumSize: 5
    };

    beforeEach(function() {
      colors = [{}, {}, {}];
      shade = new Shade({
        colors: colors.slice(),
        maximumSize: 3
      });
      inputColor = {};
    });

    describe("constructor", function() {
      it("assigns colors", function() {
        expect(shade.colors()).to.eql(colors);
      });
      it("assigns maximumSize", function() {
        expect(shade.maximumSize).to.eq(3);
      });
      it("assigns expected defaults", function() {
        shade = new Shade();
        expect(shade.colors()).to.eql( defaults.colors );
        expect(shade.maximumSize).to.eq( defaults.maximumSize );
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

    describe("handling max size", function() {
      beforeEach(function() {
        function setDistance(colorA, colorB, distance) {
          function prepareColor(color) {
            if (!isNaN(color)) color = colors[color];
            if (!color.distance) {
              color.distance = sinon.stub();
              color.distance.withArgs(color).returns(0);
            }
            return color;
          }
          colorA = prepareColor(colorA);
          colorB = prepareColor(colorB);
          colorA.distance.withArgs(colorB).returns(distance);
          colorB.distance.withArgs(colorA).returns(distance);
        }

        setDistance(0,1,10);
        setDistance(0,2,20);
        setDistance(1,2,50);
        setDistance(0,inputColor,30);
        setDistance(1,inputColor,50);
        setDistance(2,inputColor,50);
      });

      describe(".distictness()", function() {
        it("returns color's total distance to others", function() {
          expect(shade.distinctness(colors[0])).to.eq(30);
          expect(shade.distinctness(colors[1])).to.eq(60);
          expect(shade.distinctness(colors[2])).to.eq(70);
          expect(shade.distinctness(inputColor)).to.eq(130);
        });
      });

      describe(".leastDistinctColor()", function() {
        it("returns color with lowest distinctness", function() {
          expect(shade.leastDistinctColor()).to.eq(colors[0]);
        });
      });

      describe(".calibrate() after the shade is full", function() {
        it("keeps only the most distinct colors", function() {
          shade.calibrate( inputColor );
          expect(shade.colors()).not.to.include(colors[0]);
          expect(shade.colors()).to.include(colors[1]);
          expect(shade.colors()).to.include(colors[2]);
          expect(shade.colors()).to.include(inputColor);
        });
      });

    });

  });
});
