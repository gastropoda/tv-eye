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
      var accumulator, delta;
      beforeEach(function() {
        accumulator = new ByteColor(0, 0, 0);
        delta = new ByteColor(50, 150, 200);
      });
      it("accumulates rgb values", function() {
        accumulator.accumulate(delta);
        expect(accumulator.red).to.eq(delta.red);
        expect(accumulator.green).to.eq(delta.green);
        expect(accumulator.blue).to.eq(delta.blue);
        accumulator.accumulate(delta);
        expect(accumulator.red).to.eq(delta.red * 2);
        expect(accumulator.green).to.eq(delta.green * 2);
        expect(accumulator.blue).to.eq(delta.blue * 2);
      });
      it("leaves alpha value alone", function() {
        var initialAlpha = accumulator.alpha;
        accumulator.accumulate(delta);
        expect(accumulator.alpha).to.eq(initialAlpha);
        accumulator.accumulate(delta);
        expect(accumulator.alpha).to.eq(initialAlpha);
      });
    });
    describe(".attenuate()", function() {
      var initialColor, accumulator, divisor = 5;
      beforeEach(function() {
        initialColor = new ByteColor(35, 21, 10);
        accumulator = new ByteColor(initialColor);
      });
      it("divides rgb values by argument then floors", function() {
        accumulator.attenuate(divisor);
        expect(accumulator.red).to.eq(Math.floor(initialColor.red / divisor));
        expect(accumulator.green).to.eq(Math.floor(initialColor.green / divisor));
        expect(accumulator.blue).to.eq(Math.floor(initialColor.blue / divisor));
      });
      it("leaves alpha value alone", function() {
        var initialAlpha = accumulator.alpha;
        accumulator.attenuate(divisor);
        expect(accumulator.alpha).to.eq(initialAlpha);
      });
    });
  });
});
