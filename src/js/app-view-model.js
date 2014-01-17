define([
    /* captured by function args */
    "jquery", "knockout", "flood-fill", "color-patch",
    /* not captured */
    "jquery.image-canvas"
], function($, ko, FloodFill, ColorPatch) {

  function htmlizeColor(c) {
    return "rgb(" + [c.r, c.g, c.b].join(",") + ")";
  }

  return function AppViewModel() {
    var self = this;
    var imageData, context;

    self.patches = ko.observableArray([]);

    self.onCanvasClick = function(e) {
      var x = e.offsetX;
      var y = e.offsetY;
      var c = imageData.color(x, y);

      var patch = imageData.floodFill(x, y, 30, 150);
      context.putImageData(
        imageData,
        0, 0,
        patch.bounds.x, patch.bounds.y,
        patch.bounds.w, patch.bounds.h);

      self.patches.push(new ColorPatch({
        area: patch.area,
        color: htmlizeColor(patch.averageColor),
        bounds: patch.bounds
      }));

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
