$(function() {
  function makeCanvas(id, width, height) {
    return $("<canvas/>").attr("id", id).attr("width", width).attr("height", height);
  };

  function getCanvas(element) {
    return element.get(0).getContext("2d");
  };

  function replaceImageWithCanvas(image, canvasId) {
    var imageWidth = image.width();
    var imageHeight = image.height();

    var canvasElement = makeCanvas(canvasId, image.width(), image.height());
    var canvas = getCanvas(canvasElement);
    canvas.drawImage(image.get(0), 0, 0);
    image.replaceWith(canvasElement);
    return canvasElement;
  };

  function extendImageData(imageData) {
    var self = imageData;
    var rgba = self.data;

    self.color = function(x, y) {
      var offset = 4 * (x + self.width * y);
      return {
        r: rgba[offset],
        g: rgba[offset + 1],
        b: rgba[offset + 2],
        a: rgba[offset + 3],
      };
    };

    self.floodFillTest = function(x, y, targetColor, tolerance) {
      var c = self.color(x, y);
      return c.a == 255 &&
        (Math.abs(c.r - targetColor.r) < tolerance) &&
        (Math.abs(c.g - targetColor.g) < tolerance) &&
        (Math.abs(c.b - targetColor.b) < tolerance);
    };

    self.floodFill = function(x, y, tolerance, markValue) {
      var width = self.width,
        height = self.height,
        rgba = self.data;

      var targetColor = self.color(x, y);
      var queue = [[x, y]];

      while (queue.length > 0) {
        var unqueued = queue.shift();
        if (self.floodFillTest(unqueued[0], unqueued[1], targetColor, tolerance)) {
          var xWest = unqueued[0],
            xEast = unqueued[0];
          var yWestEast = unqueued[1];
          while (xWest > 0 &&
            self.floodFillTest(xWest - 1, yWestEast, targetColor, tolerance)) {
            xWest--;
          }

          while (xEast < self.width - 1 &&
            self.floodFillTest(xEast + 1, yWestEast, targetColor, tolerance)) {
            xEast++;
          }
          for (var x = xWest; x <= xEast; x++) {
            rgba[(x + yWestEast * self.width) * 4 + 3] = markValue;
            if (yWestEast > 0 &&
              self.floodFillTest(x, yWestEast - 1, targetColor, tolerance)) {
              queue.push([x, yWestEast - 1]);
            }
            if (yWestEast < self.height - 1 &&
              self.floodFillTest(x, yWestEast + 1, targetColor, tolerance)) {
              queue.push([x, yWestEast + 1]);
            }
          }
        }
      }
    };
  };

  $(window).load(function() {
    var canvasElement = replaceImageWithCanvas($("img#input_image"), "input");
    var canvas = getCanvas(canvasElement);

    var canvasWidth = canvasElement.width();
    var canvasHeight = canvasElement.height();

    var imageData = canvas.getImageData(0, 0, canvasWidth, canvasHeight);
    extendImageData(imageData);

    canvasElement.click(function(e) {
      var x = e.offsetX,
        y = e.offsetY;
      var c = imageData.color(x, y);

      console.log("x: " + x + ", y: " + y + "r: " + c.r + ", g: " + c.g + ", b: " + c.b);

      imageData.floodFill(x, y, 30, 150);
      canvas.putImageData(imageData, 0, 0);
    });
  });
});
