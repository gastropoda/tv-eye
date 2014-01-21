define([
    /* captured by function args */
    "jquery", "knockout", "paper", "flood-fill", "color-patch", "patch-list",
    "color-patches-layer"
    /* not captured */
], function($, ko, paper, FloodFill, ColorPatch, PatchList,
  ColorPatchesLayer) {

  var NO_PATCH = 255;

  function AppViewModel() {
    var self = this;

    self.config = {
      pick: {
        tolerance: 30
      }
    };

    paper.setup($("<canvas/>").appendTo("#scratch").get(0));

    var imageData;
    var raster = new paper.Raster("img/groningen-test.jpg");
    raster.onLoad = function() {
      paper.view.setViewSize(this.size);
      this.setPosition(this.size.divide(2));
      imageData = raster.getImageData();
      FloodFill.extend(imageData);
    };
    raster.onClick = function(event) {
      var point = event.point;
      var patchIndex = patchIndexAt(point);
      if (patchIndex == NO_PATCH) {
        var patch = self.findPatch(point);
        patchList.put(patch);
      }
      else {
        patchList.get(patchIndex).toggleSelected();
      }
    };

    function patchIndexAt(point) {
      var rgba = imageData.data;
      return rgba[(point.x + point.y * imageData.width) * 4 + 3];
    }

    self.findPatch = function(point) {
      return imageData.floodFill(point, self.config.pick.tolerance, patchList.nextIndex());
    };

    var patchList = new PatchList();
    self.patches = patchList.patches;
    self.patchCount = ko.computed(function() {
      return self.patches().length;
    });
    self.minPatchSize = ko.computed(function() {
      return self.patches().minSize();
    });
    self.maxPatchSize = ko.computed(function() {
      return self.patches().maxSize();
    });
    self.removePatch = function(patch) {
      var index = patchList.remove(patch);
      imageData.replaceIndex(index, NO_PATCH, patch.bounds());
    };

    ColorPatchesLayer.setup(self.patches);
  }
  return AppViewModel;
});
