define([
    /* captured by function args */
    "jquery", "knockout", "flood-fill", "color-patch", "patch-list",
    /* not captured */
    "jquery.image-canvas"
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

    function nextPatchIndex() {
      return patchList.nextIndex();
    }

    self.findPatch = function(x, y) {
      var patch = imageData.floodFill(x, y, 30, nextPatchIndex());
      context.putImageData(
        imageData,
        0, 0,
        patch.bounds.x, patch.bounds.y,
        patch.bounds.w, patch.bounds.h);

      return new ColorPatch({
        area: patch.area,
        color: htmlizeColor(patch.averageColor),
        bounds: patch.bounds
      });
    };

    self.removePatch = function(patch) {
      patchList.remove(patch)
    };

    self.onCanvasClick = function(e) {
      var x = e.offsetX;
      var y = e.offsetY;
      var c = imageData.color(x, y);

      if (c.a == NO_PATCH) {
        patchList.put(self.findPatch(x, y));
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
