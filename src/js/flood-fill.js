define([
    "paper", "jquery", "color-patch"
], function(paper, $, ColorPatch) {

  var FloodFillMixin = {
    color: function(x, y) {
      var offset = (x + this.width * y) * 4;
      var rgba = this.data;
      return {
        r: rgba[offset],
        g: rgba[offset + 1],
        b: rgba[offset + 2],
        a: rgba[offset + 3],
      };
    },

    setColor: function(x, y, obj) {
      if (!(obj instanceof Array)) {
        obj = [obj.r, obj.g, obj.b, obj.a];
      }
      var offset = (x + this.width * y) * 4;
      var rgba = this.data;
      $.each(obj, function(i, value) {
        if (!isNaN(value)) {
          rgba[ offset + i ] = value;
        }
      });
    },

    floodFill: function(point, tolerance, markValue) {
      var x = point.x;
      var y = point.y;
      var width = this.width;
      var height = this.height;
      var targetColor = this.color(x, y);
      var self = this;

      var acc = {
        r: 0,
        g: 0,
        b: 0
      };
      var area = 0;
      var bounds;

      function updateBounds(xWest, xEast, y) {
        var line = new paper.Rectangle(xWest, y, xEast - xWest + 1, 1);
        if (bounds) {
          bounds = bounds.unite(line);
        }
        else {
          bounds = line;
        }
      }

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

          while (xEast < this.width - 1 && floodFillTest(xEast + 1, y)) {
            xEast++;
          }
          updateBounds(xWest, xEast, y);
          for (var x = xWest; x <= xEast; x++) {
            var pixel = this.color(x,y);
            area++;
            acc.r += pixel.r;
            acc.g += pixel.g;
            acc.b += pixel.b;
            this.setColor(x, y, {a: markValue});

            if (y > 0 && floodFillTest(x, y - 1)) {
              queue.push([x, y - 1]);
            }
            if (y < this.height - 1 && floodFillTest(x, y + 1)) {
              queue.push([x, y + 1]);
            }
          }
        }
      }
      return new ColorPatch({
        area: area,
        color: {
          r: Math.floor(acc.r / area),
          g: Math.floor(acc.g / area),
          b: Math.floor(acc.b / area),
        },
        bounds: bounds
      });
    },

    replaceIndex: function(inIndex, outIndex, roi) {
      for (var y = roi.y; y < roi.y + roi.height; y++) {
        for (var x = roi.x; x < roi.x + roi.width; x++) {
          var offset = (x + y * this.width) * 4 + 3;
          if (this.data[offset] === inIndex)
            this.data[offset] = outIndex;
        }
      }
    }
  }

  return {
    extend: function(imageData) {
      $.extend(imageData, FloodFillMixin);
    }
  };


});
