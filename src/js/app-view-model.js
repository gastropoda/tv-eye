define([
    /* captured by function args */
    "jquery", "knockout", "flood-fill", "color-patch", "patch-list",
    /* not captured */
    "paper", "jquery.image-canvas"
], function($, ko, FloodFill, ColorPatch, PatchList) {

  var NO_PATCH = 255;

  function htmlizeColor(c) {
    return "rgb(" + [c.r, c.g, c.b].join(",") + ")";
  }

  return function AppViewModel() {
    var self = this;
    var imageData, context;

    var patchList = new PatchList();

    self.patches = patchList.patches;
    self.patchCount = ko.computed(function() {
      return self.patches().length;
    });

    self.minPatchSize = ko.computed(function() {
      var minSize;
      self.patches().forEach(function(patch) {
        var patchSize = patch.bounds().size;
        minSize = minSize ? paper.Size.min(minSize, patchSize) : patchSize;
      });
      return minSize;
    });

    self.maxPatchSize = ko.computed(function() {
      var maxSize;
      self.patches().forEach(function(patch) {
        var patchSize = patch.bounds().size;
        maxSize = maxSize ? paper.Size.max(maxSize, patchSize) : patchSize;
      });
      return maxSize;
    });

    function nextPatchIndex() {
      return patchList.nextIndex();
    }

    self.findPatch = function(x, y) {
      var patch = imageData.floodFill(x, y, 30, nextPatchIndex());
      return new ColorPatch({
        area: patch.area,
        color: htmlizeColor(patch.averageColor),
        bounds: patch.bounds
      });
    };

    self.removePatch = function(patch) {
      var index = patchList.remove(patch);
      imageData.replaceIndex(index, NO_PATCH, patch.bounds());
      refreshPatch(patch);
    };

    function refreshPatch(patch) {
      context.putImageData(
        imageData,
        0, 0,
        patch.bounds().x, patch.bounds().y,
        patch.bounds().width, patch.bounds().height);
    }

    self.onCanvasClick = function(e) {
      var x = e.offsetX;
      var y = e.offsetY;
      var c = imageData.color(x, y);

      if (c.a == NO_PATCH) {
        var patch = self.findPatch(x, y);
        patchList.put(patch);
        refreshPatch(patch);
      }
      else {
        patchList.get(c.a).toggleSelected();
      }

    };

    $("#scratch").loadImageCanvas("img/groningen-test.jpg", function(canvas) {
      var canvasWidth = canvas.width();
      var canvasHeight = canvas.height();
      context = canvas.context2d();
      imageData = context.getImageData(0, 0, canvasWidth, canvasHeight);
      FloodFill.extend(imageData);
      canvas.on("click", self.onCanvasClick);
      canvas.hide().fadeIn(300);
    });
  };

});
