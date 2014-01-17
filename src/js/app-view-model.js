define([
    /* captured by function args */
    "jquery", "knockout", "flood-fill", "color-patch",
    /* not captured */
    "jquery.image-canvas"
], function($, ko, floodFill, ColorPatch) {

  return function AppViewModel() {
    var self = this;
    var imageData, context;

    self.patches = ko.observableArray([]);

    self.onCanvasClick = function(e) {
      var x = e.offsetX;
      var y = e.offsetY;
      var c = imageData.color(x, y);

      var fillStats = imageData.floodFill(x, y, 30, 150);
      console.log("x: " + x + ", y: " + y + "r: " + c.r + ", g: " + c.g + ", b: " + c.b);
      console.log("fillStats area: " + fillStats.area + ", avg color r: " + fillStats.averageColor.r +
        ", g: " + fillStats.averageColor.g + ", b: " + fillStats.averageColor.b);

      var dirtyCorner = fillStats.bounds[0];
      var dirtySize = [fillStats.bounds[1][0] - dirtyCorner[0], fillStats.bounds[1][1] - dirtyCorner[1]];
      context.putImageData(
        imageData,
        0, 0,
        dirtyCorner[0], dirtyCorner[1],
        dirtySize[0], dirtySize[1]);

      self.patches.push( new ColorPatch({area: fillStats.area}) );

    };

    $("#scratch").loadImageCanvas("img/groningen-test.jpg", function(canvas) {
      var canvasWidth = canvas.width();
      var canvasHeight = canvas.height();
      context = canvas.context2d();
      imageData = context.getImageData(0, 0, canvasWidth, canvasHeight);
      floodFill.extend(imageData);
      canvas.on("click", self.onCanvasClick);
      canvas.hide().fadeIn(300);
    });
  };

});
