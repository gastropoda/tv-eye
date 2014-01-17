define(["patch-list", "color-patch"], function(PatchList, ColorPatch) {
  describe("PatchList", function() {
    var patchList;
    var ko = require("knockout");
    var somePatches;

    beforeEach(function() {
      somePatches = [new ColorPatch(), new ColorPatch(), new ColorPatch()];
    });

    describe(".patches()", function() {
      it("starts up empty", function() {
        patchList = new PatchList();
        expect(patchList.patches()).to.be.empty;
      });

      describe("with some patches", function() {

        it("returns the patches", function() {
          patchList = new PatchList(somePatches);
          expect(patchList.patches()).to.eql(somePatches);
        });

        it("filters out nulls", function() {
          somePatches[1] = null;
          patchList = new PatchList(somePatches);
          expect(patchList.patches()).to.eql([somePatches[0], somePatches[2]]);
        });

        it("filters out deselected patches", function() {
          somePatches[1].toggleSelected();
          patchList = new PatchList(somePatches);
          expect(patchList.patches()).to.eql([somePatches[0], somePatches[2]]);
        });
      });
    });

    describe(".get()", function() {

      it("returns a patch by index", function() {
        patchList = new PatchList(somePatches);
        for (var i = 0; i < 3; i++) {
          expect(patchList.get(i)).to.eq(somePatches[i]);
        }
        expect(patchList.get(3)).to.not.be.ok;
      });
    });

    describe(".remove()", function() {

      it("replaces a patch with null", function() {
        patchList = new PatchList(somePatches);
        patchList.remove(1);
        expect(patchList.get(0),"patch[0]").to.eq(somePatches[0]);
        expect(patchList.get(1),"patch[1]").to.be.null;
        expect(patchList.get(2),"patch[2]").to.eq(somePatches[2]);
      });
    });
  });
});
