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

      self.floodFillTest = function(x, y, targetColor, tolerance) {
        var c = self.color(x, y);
        return c.a == 255 &&
          (Math.abs(c.r - targetColor.r) < tolerance) &&
          (Math.abs(c.g - targetColor.g) < tolerance) &&
          (Math.abs(c.b - targetColor.b) < tolerance);
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
              area++;
              acc.r += rgba[(x + yWestEast * self.width) * 4];
              acc.g += rgba[(x + yWestEast * self.width) * 4 + 1];
              acc.b += rgba[(x + yWestEast * self.width) * 4 + 2];
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
