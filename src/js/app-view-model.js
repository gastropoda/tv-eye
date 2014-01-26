define([
    /* captured by function args */
    "jquery", "knockout", "color-patch", "patch-list", "color-patches-layer", "shade",
    "spectrum", "byte-color", "persist", "interactive-image"
    /* not captured */
], function($, ko, ColorPatch, PatchList, ColorPatchesLayer, Shade, Spectrum,
  ByteColor, persist, InteractiveImage) {

  function AppViewModel() {
    this.NO_PATCH = 255;
    this.floodFillTolerance = 30;
    this.manualTolerance = persist("manualTolerance", ko.observable(40));
    this.spectrum = new Spectrum({ shades: [ makeShade(60, 142, 52),
                                             makeShade(215, 56, 128),
                                             makeShade(192, 163, 33)]});
    this.patchList = new PatchList();
    this.patches = this.patchList.patches;
    this.patchCount = ko.computed(function() { return this.patches().length; }, this);
    this.minPatchSize = ko.computed(function() { return this.patches().minSize(); }, this);
    this.maxPatchSize = ko.computed(function() { return this.patches().maxSize(); }, this);
    this.maxLogMessages = 10;
    this.messages = ko.observableArray();
    InteractiveImage.setup("img/groningen-test.jpg",this);
    ColorPatchesLayer.setup(this.patches);
    this.log("FIXME extract template loader", "red");

    function makeShade(r,g,b) {
      return new Shade({ colors: [new ByteColor(r,g,b)], maximumSize: 3});
    }
  }

  AppViewModel.prototype.adjustSpectrum = function(_, event) {
    var self = this;
    this.patches().forEach(function(patch){
      var shade;
      if (shade = self.spectrum.classifyColor(patch.color(), self.manualTolerance())) {
        shade.calibrate(patch.color());
        self.log("Calibrated " + shade, shade.colors()[0].toCSS());
      }
    });
  }

  AppViewModel.prototype.findPatch = function(point) {
    return this.imageData.floodFill(point, this.floodFillTolerance, this.patchList.nextIndex());
  };

  AppViewModel.prototype.removePatch = function(patch) {
    var index = this.patchList.remove(patch);
    this.imageData.replaceIndex(index, this.NO_PATCH, patch.bounds());
  };

  AppViewModel.prototype.log = function(message, color) {
    color = color || "black";
    this.messages.unshift({
      message: message,
      color: color
    });
    while (this.messages().length > this.maxLogMessages) {
      this.messages.pop();
    }
  }

  return AppViewModel;
});
