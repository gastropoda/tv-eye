define(["patch-list", "color-patch"], function(PatchList, ColorPatch) {
  describe("PatchList", function() {
    var _patchList_;
    var ko = require("knockout");
    var somePatches;
    var newPatch;

    beforeEach(function() {
      _patchList_ = null;
      somePatches = [new ColorPatch(), new ColorPatch(), new ColorPatch()];
      newPatch = new ColorPatch();
    });

    function emptyList() {
      return _patchList_ || (_patchList_ = new PatchList());
    }

    function patchList() {
      return _patchList_ || (_patchList_ = new PatchList(somePatches));
    }
    function fullList() {
      sinon.stub(patchList(), "maxCount").returns(somePatches.length);
      return patchList();
    }

    describe(".patches()", function() {
      it("starts up empty", function() {
        expect(emptyList().patches()).to.be.empty;
      });

      describe("with some patches", function() {
        it("returns the patches", function() {
          expect(patchList().patches()).to.eql(somePatches);
        });

        it("filters out nulls", function() {
          somePatches[1] = null;
          expect(patchList().patches()).to.eql([somePatches[0], somePatches[2]]);
        });

        it("filters out deselected patches", function() {
          somePatches[1].toggleSelected();
          expect(patchList().patches()).to.eql([somePatches[0], somePatches[2]]);
        });
      });
    });

    describe(".get()", function() {
      it("returns a patch by index", function() {
        for (var i = 0; i < 3; i++) {
          expect(patchList().get(i)).to.eq(somePatches[i]);
        }
        expect(patchList().get(3)).to.not.be.ok;
      });
    });

    describe(".remove()", function() {
      it("replaces a patch with null", function() {
        patchList().remove(1);
        expect(patchList().get(0), "patch[0]").to.eq(somePatches[0]);
        expect(patchList().get(1), "patch[1]").to.be.null;
        expect(patchList().get(2), "patch[2]").to.eq(somePatches[2]);
      });
    });

    describe(".nextIndex()", function() {
      it("starts with 0", function() {
        expect(emptyList().nextIndex()).to.be.zero;
      });

      it("points after filled list", function() {
        expect(patchList().nextIndex()).to.eq(3);
      });

      it("points to empty place if any", function() {
        somePatches[1] = null;
        expect(patchList().nextIndex()).to.eq(1);
      });

      it("returns -1 if no places left", function() {
        expect(fullList().nextIndex()).to.eq(-1);
      });
    });

    describe(".put()", function() {
      it("puts a patch at nextIndex", function() {
        sinon.stub(patchList(), "nextIndex").returns(42);
        patchList().put( newPatch );
        expect(patchList().get(42)).to.eq(newPatch);
      });

      it("throws an exception if list is full", function() {
        expect( function() {
          fullList.put( newPatch );
        }).to.throw(/full/);
      });
    });

  });
});
