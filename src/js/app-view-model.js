define([
    /* captured by function args */
    "jquery", "knockout", "paper", "flood-fill", "color-patch", "patch-list", "color-patches-layer",
    "shade", "spectrum", "byte-color"
    /* not captured */
], function($, ko, paper, FloodFill, ColorPatch, PatchList, ColorPatchesLayer, Shade, Spectrum,
  ByteColor) {

  var NO_PATCH = 255;
  var PICK_TOLERANCE = 30;

  function AppViewModel() {
    var self = this;

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
      var pixel = imageData.color(point);
      var patchIndex = pixel.alpha;
      if (patchIndex == NO_PATCH) {
        if (spectrum.classifyColor(pixel, true)) {
          var patch = self.findPatch(point);
          patchList.put(patch);
        }
        else {
          console.log("pixel rejected");
        }
      }
      else {
        patchList.get(patchIndex).toggleSelected();
      }
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

    self.findPatch = function(point) {
      return imageData.floodFill(point, PICK_TOLERANCE, patchList.nextIndex());
    };
    self.removePatch = function(patch) {
      var index = patchList.remove(patch);
      imageData.replaceIndex(index, NO_PATCH, patch.bounds());
    };

    ColorPatchesLayer.setup(self.patches);

    this.shades = [
      new Shade({
        colors: [new ByteColor(60, 142, 52)]
      }),
      new Shade({
        colors: [new ByteColor(215, 56, 128)]
      }),
      new Shade({
        colors: [new ByteColor(192, 163, 33)]
      })
    ];
    var spectrum = new Spectrum({
      shades: this.shades,
      discriminationTolerance: 30,
      calibrationTolerance: 100
    });
  }
  return AppViewModel;
});
