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
        color.accumulate(delta);
        expect(color.red).to.eq(delta.red);
        expect(color.green).to.eq(delta.green);
        expect(color.blue).to.eq(delta.blue);
        color.accumulate(delta);
        expect(color.red).to.eq(delta.red * 2);
        expect(color.green).to.eq(delta.green * 2);
        expect(color.blue).to.eq(delta.blue * 2);
      });
      it("leaves alpha value alone", function() {
        var initialAlpha = color.alpha;
        color.accumulate(delta);
        expect(color.alpha).to.eq(initialAlpha);
        color.accumulate(delta);
        expect(color.alpha).to.eq(initialAlpha);
      });
      it("returns color", function(){
        expect(color.accumulate(delta)).to.eq(color);
      });
    });

    describe(".attenuate()", function() {
      var initialColor, color, divisor = 5;
      beforeEach(function() {
        initialColor = new ByteColor(35, 21, 10);
        color = new ByteColor(initialColor);
      });
      it("divides rgb values by argument then floors", function() {
        color.attenuate(divisor);
        expect(color.red).to.eq(Math.floor(initialColor.red / divisor));
        expect(color.green).to.eq(Math.floor(initialColor.green / divisor));
        expect(color.blue).to.eq(Math.floor(initialColor.blue / divisor));
      });
      it("leaves alpha value alone", function() {
        var initialAlpha = color.alpha;
        color.attenuate(divisor);
        expect(color.alpha).to.eq(initialAlpha);
      });
      it("returns color", function(){
        expect(color.attenuate(divisor)).to.eq(color);
      });
    });

    describe(".equals()", function() {
      var color = new ByteColor(10, 20, 30, 127);
      var sameColor = new ByteColor(color);
      var otherColor = new ByteColor(30, 20, 10);

      it("is truthy for same colors", function() {
        expect( color.equals(sameColor) ).to.be.true;
      });
      it("is falsy for different colors", function() {
        expect( color.equals(otherColor) ).to.be.false;
      });
    });
  });
});
