define(["color-patch"], function(ColorPatch) {
  describe("ColorPatch", function() {
    describe("selected", function() {
      var patch = new ColorPatch
      it("is false by default", function() {
        expect(patch.selected()).to.be.false;
      });

      it("with argument changes and returns the value", function() {
        expect(patch.selected(true)).to.be.true;
        expect(patch.selected()).to.be.true;
        expect(patch.selected(false)).to.be.false;
        expect(patch.selected()).to.be.false;
      });

    });
  });
});
