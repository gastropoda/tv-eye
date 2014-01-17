define(["patch-list", "color-patch"], function(PatchList, ColorPatch) {
  describe("PatchList", function() {
    var patchList;
    var ko = require("knockout");

    beforeEach(function() {
      patchList = new PatchList();
    });

    describe(".patches()", function() {
      it("starts up empty", function() {
        expect(patchList.patches()).to.be.empty;
      });

      describe("with some patches", function() {
        var somePatches;

        beforeEach(function() {
          somePatches = [new ColorPatch(), new ColorPatch(), new ColorPatch()];
        });

        it("returns the patches", function() {
          patchList = new PatchList(somePatches);
          expect(patchList.patches()).to.eql(somePatches);
        });

        it("filters out nulls", function() {
          somePatches[1] = null;
          patchList = new PatchList(somePatches);
          expect(patchList.patches()).to.eql([ somePatches[0], somePatches[2] ]);
        });

        it("filters out deselected patches", function() {
          somePatches[1].toggleSelected();
          patchList = new PatchList(somePatches);
          expect(patchList.patches()).to.eql([ somePatches[0], somePatches[2] ]);
        });

      });
    });

  });
});
