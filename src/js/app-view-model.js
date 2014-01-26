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
        log("pixel: " + pixel);
        spectrum.shades().forEach(function(shade) {
          log("distance: " + shade.distance(pixel), shade.colors()[0]);
        });

        var shade = spectrum.classifyColor(pixel, true);
        if (shade) {
          log("Calibrated " + shade,
              shade.colors()[0].toCSS());
          var patch = self.findPatch(point);
          patchList.put(patch);
        }
        else {
          log("pixel rejected", "red");
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
        colors: [new ByteColor(60, 142, 52)],
        maximumSize: 3
      }),
      new Shade({
        colors: [new ByteColor(215, 56, 128)],
        maximumSize: 3
      }),
      new Shade({
        colors: [new ByteColor(192, 163, 33)],
        maximumSize: 3
      })
    ];
    var spectrum = new Spectrum({
      shades: this.shades,
      discriminationTolerance: 30,
      calibrationTolerance: 100
    });

    var MAX_LOG_MESSAGES = 10;
    self.log = ko.observableArray();
    function log(message, color) {
      color = color || "black";
      self.log.unshift({
        message: message,
        color: color
      });
      while (self.log().length > MAX_LOG_MESSAGES) {
        self.log.pop();
      }
    }
    log("FIXME extract template loader", "red");
  }

  return AppViewModel;
});
