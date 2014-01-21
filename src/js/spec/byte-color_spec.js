define(["byte-color"], function(ByteColor) {
  describe("ByteColor", function() {
    it("is constructable with 3 numbers", function() {
      var color = new ByteColor(10, 20, 30);
      expect(color.red).to.eq(10);
      expect(color.green).to.eq(20);
      expect(color.blue).to.eq(30);
      expect(color.alpha).to.eq(255);
    });

    it("is constructable with 4 numbers", function() {
      var color = new ByteColor(10, 20, 30, 40);
      expect(color.red).to.eq(10);
      expect(color.green).to.eq(20);
      expect(color.blue).to.eq(30);
      expect(color.alpha).to.eq(40);
    });

    it("is constructable with an object", function() {
      var color = new ByteColor({
        red: 10,
        green: 20,
        blue: 30,
        alpha: 40
      });
      expect(color.red).to.eq(10);
      expect(color.green).to.eq(20);
      expect(color.blue).to.eq(30);
      expect(color.alpha).to.eq(40);
    });

    it("defaults to opaque black", function() {
      var color = new ByteColor();
      expect(color.red).to.eq(0);
      expect(color.green).to.eq(0);
      expect(color.blue).to.eq(0);
      expect(color.alpha).to.eq(255);
    });

    it("can be partially initialized", function() {
      var color = new ByteColor({
        red: 10
      });
      expect(color.red).to.eq(10);
      expect(color.green).to.eq(0);
      expect(color.blue).to.eq(0);
      expect(color.alpha).to.eq(255);
    });

    describe(".accumulate()", function() {
      var color, delta;
      beforeEach(function() {
        color = new ByteColor(0, 0, 0);
        delta = new ByteColor(50, 150, 200);
      });
      it("accumulates rgb values", function() {
        color = color.accumulate(delta);
        expect(color.red).to.eq(delta.red);
        expect(color.green).to.eq(delta.green);
        expect(color.blue).to.eq(delta.blue);
        color = color.accumulate(delta);
        expect(color.red).to.eq(delta.red * 2);
        expect(color.green).to.eq(delta.green * 2);
        expect(color.blue).to.eq(delta.blue * 2);
      });
      it("leaves alpha value alone", function() {
        var initialAlpha = color.alpha;
        color = color.accumulate(delta);
        expect(color.alpha).to.eq(initialAlpha);
        color = color.accumulate(delta);
        expect(color.alpha).to.eq(initialAlpha);
      });
      it("supports parial colors", function() {
        var newColor = color.accumulate({
          red: 5
        });
        expect(newColor.red).to.eq(5);
        expect(newColor.green).to.eq(0);
        expect(newColor.blue).to.eq(0);
      });
    });

    describe(".attenuate()", function() {
      var initialColor, color, divisor = 5;
      beforeEach(function() {
        initialColor = new ByteColor(35, 21, 10);
        color = new ByteColor(initialColor);
      });
      it("divides rgb values by argument then floors", function() {
        color = color.attenuate(divisor);
        expect(color.red).to.eq(Math.floor(initialColor.red / divisor));
        expect(color.green).to.eq(Math.floor(initialColor.green / divisor));
        expect(color.blue).to.eq(Math.floor(initialColor.blue / divisor));
      });
      it("leaves alpha value alone", function() {
        var initialAlpha = color.alpha;
        color = color.attenuate(divisor);
        expect(color.alpha).to.eq(initialAlpha);
      });
    });

    describe(".equals()", function() {
      var color = new ByteColor(10, 20, 30, 127);
      var sameColor = new ByteColor(color);
      var otherColor = new ByteColor(30, 20, 10);

      it("is truthy for same colors", function() {
        expect(color.equals(sameColor)).to.be.true;
      });
      it("is falsy for different colors", function() {
        expect(color.equals(otherColor)).to.be.false;
      });
    });

    describe(".within()", function() {
      var tolerance = 10;
      var color = new ByteColor(127, 20, 30);
      var closeColor = color.accumulate({
        red: tolerance / 2
      });
      var edgeColor = color.accumulate({
        red: tolerance
      });
      var farColor = color.accumulate({
        red: tolerance * 2
      });

      it("is true for colors within tolerance", function() {
        expect(color.within(tolerance, closeColor)).to.be.true;
      });
      it("is false for colors outside tolerance", function() {
        expect(color.within(tolerance, farColor)).to.be.false;
      });
      it("is true for colors at the edge of tolerance", function() {
        expect(color.within(tolerance, edgeColor)).to.be.true;
      });
    });
  });
});
