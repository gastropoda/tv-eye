define(["byte-color"], function(ByteColor) {
  describe("ByteColor", function() {
    it("is constructable with 3 numbers", function() {
      var color = new ByteColor(10, 20, 30);
      expect( color.red ).to.eq(10);
      expect( color.green ).to.eq(20);
      expect( color.blue ).to.eq(30);
      expect( color.alpha ).to.eq(255);
    });

    it("is constructable with 4 numbers", function() {
      var color = new ByteColor(10, 20, 30, 40);
      expect( color.red ).to.eq(10);
      expect( color.green ).to.eq(20);
      expect( color.blue ).to.eq(30);
      expect( color.alpha ).to.eq(40);
    });

    it("is constructable with an object", function() {
      var color = new ByteColor({red: 10, green: 20, blue: 30, alpha: 40});
      expect( color.red ).to.eq(10);
      expect( color.green ).to.eq(20);
      expect( color.blue ).to.eq(30);
      expect( color.alpha ).to.eq(40);
    });

    it("defaults to opaque black", function() {
      var color = new ByteColor();
      expect( color.red ).to.eq(0);
      expect( color.green ).to.eq(0);
      expect( color.blue ).to.eq(0);
      expect( color.alpha ).to.eq(255);
    });

    it("can be partially initialized", function() {
      var color = new ByteColor({red: 10});
      expect( color.red ).to.eq(10);
      expect( color.green ).to.eq(0);
      expect( color.blue ).to.eq(0);
      expect( color.alpha ).to.eq(255);
    });
  });
});
