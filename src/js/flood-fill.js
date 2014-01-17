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
        var minX = x;
        var maxX = x;
        var minY = y;
        var maxY = y;

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
            var y = unqueued[1];
            while (xWest > 0 && floodFillTest(xWest - 1, y)) {
              xWest--;
            }

            while (xEast < self.width - 1 && floodFillTest(xEast + 1, y)) {
              xEast++;
            }
            for (var x = xWest; x <= xEast; x++) {
              area++;
              acc.r += rgba[(x + y * self.width) * 4];
              acc.g += rgba[(x + y * self.width) * 4 + 1];
              acc.b += rgba[(x + y * self.width) * 4 + 2];
              rgba[(x + y * self.width) * 4 + 3] = markValue;
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;

              if (y > 0 && floodFillTest(x, y - 1)) {
                queue.push([x, y - 1]);
              }
              if (y < self.height - 1 && floodFillTest(x, y + 1)) {
                queue.push([x, y + 1]);
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
          bounds: {
            x: minX,
            y: minY,
            w: maxX - minX + 1,
            h: maxY - minY + 1
          }
        };
      };

    }
  };
});
