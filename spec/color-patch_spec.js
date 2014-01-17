define(["color-patch"], function(ColorPatch) {
  describe("ColorPatch", function() {
    describe("selected", function() {
      var patch = new ColorPatch
      it("is false by default", function() {
        expect(patch.selected()).to.be.false;
      });
    });

    describe("area", function() {
      var patch = new ColorPatch({area: 13});

      it("is set from options argument", function(){
        expect(patch.area()).to.eq(13);
      });
    });

    describe("color", function() {
      var color = {r: 0, g: 1, b: 2, a: 3};
      var patch = new ColorPatch({color: color});
      it("is set from option argument", function(){
        expect(patch.color()).to.eql(color);
      });
    });

    describe("bounds", function() {
      var bounds = [[1,1],[3,3]];
      var patch = new ColorPatch({bounds: bounds});
      it("is set from option argument", function(){
        expect(patch.bounds()).to.eql(bounds);
      });
    });

  });
});
