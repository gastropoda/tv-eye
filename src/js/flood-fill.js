define(function() {

  return {
    extend: function(imageData) {
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

      self.floodFill = function(x, y, tolerance, markValue) {
        var width = self.width;
        var height = self.height;
        var rgba = self.data;
        var targetColor = self.color(x, y);

        var acc = {
          r: 0,
          g: 0,
          b: 0
        };
        var area = 0;

        function floodFillTest(x, y) {
          var pixelColor = self.color(x, y);
          return pixelColor.a == 255 &&
            (Math.abs(pixelColor.r - targetColor.r) <= tolerance) &&
            (Math.abs(pixelColor.g - targetColor.g) <= tolerance) &&
            (Math.abs(pixelColor.b - targetColor.b) <= tolerance);
        };

        var queue = [[x, y]];
        while (queue.length > 0) {
          var unqueued = queue.shift();
          if (floodFillTest(unqueued[0], unqueued[1])) {
            var xWest = unqueued[0],
              xEast = unqueued[0];
            var yWestEast = unqueued[1];
            while (xWest > 0 && floodFillTest(xWest - 1, yWestEast)) {
              xWest--;
            }

            while (xEast < self.width - 1 && floodFillTest(xEast + 1, yWestEast)) {
              xEast++;
            }
            for (var x = xWest; x <= xEast; x++) {
              area++;
              acc.r += rgba[(x + yWestEast * self.width) * 4];
              acc.g += rgba[(x + yWestEast * self.width) * 4 + 1];
              acc.b += rgba[(x + yWestEast * self.width) * 4 + 2];
              rgba[(x + yWestEast * self.width) * 4 + 3] = markValue;

              if (yWestEast > 0 && floodFillTest(x, yWestEast - 1)) {
                queue.push([x, yWestEast - 1]);
              }
              if (yWestEast < self.height - 1 && floodFillTest(x, yWestEast + 1)) {
                queue.push([x, yWestEast + 1]);
              }
            }
          }
        }
        return {
          area: area,
          averageColor: {
            r: Math.floor(acc.r / area),
            g: Math.floor(acc.g / area),
            b: Math.floor(acc.b / area),
          },
        };
      };

    }
  };
});
