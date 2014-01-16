define([
    /* captured by function args */
    "jquery", "flood-fill",
    /* not captured */
    "jquery.image-canvas"
], function($, floodFill) {

  function configure() {
    $("#scratch").loadImageCanvas("img/groningen-test.jpg", function(canvas) {

      var canvasWidth = canvas.width();
      var canvasHeight = canvas.height();

      var context = canvas.context2d();
      var imageData = context.getImageData(0, 0, canvasWidth, canvasHeight);

      floodFill.extend(imageData);

      canvas.on("click", function(e) {
        var x = e.offsetX;
        var y = e.offsetY;
        var c = imageData.color(x, y);

        var patch = imageData.floodFill(x, y, 30, 150);
        console.log("x: " + x + ", y: " + y + "r: " + c.r + ", g: " + c.g + ", b: " + c.b);
        console.log("patch area: " + patch.area + ", avg color r: " + patch.averageColor.r +
          ", g: " + patch.averageColor.g + ", b: " + patch.averageColor.b);

        var dirtyCorner = patch.bounds[0];
        var dirtySize = [patch.bounds[1][0] - dirtyCorner[0], patch.bounds[1][1] - dirtyCorner[1]];
        context.putImageData(
          imageData,
          0, 0,
          dirtyCorner[0], dirtyCorner[1],
          dirtySize[0], dirtySize[1]);
      });

      canvas.hide().fadeIn(300);
    });
  };

  return {
    configure: configure,
  };
});
