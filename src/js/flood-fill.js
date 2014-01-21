define([
    "paper", "jquery", "color-patch", "byte-color"
], function(paper, $, ColorPatch, ByteColor) {

  var FloodFillMixin = {
    color: function(x, y) {
      var offset = (x + this.width * y) * 4;
      var rgba = this.data;
      return new ByteColor(rgba[offset], rgba[offset + 1],
        rgba[offset + 2], rgba[offset + 3]);
    },

    setColor: function(x, y, obj) {
      if (!(obj instanceof Array)) {
        obj = [obj.red, obj.green, obj.blue, obj.alpha];
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

      var acc = new ByteColor();
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
        return pixelColor.alpha == 255 &&
          (Math.abs(pixelColor.red - targetColor.red) <= tolerance) &&
          (Math.abs(pixelColor.green - targetColor.green) <= tolerance) &&
          (Math.abs(pixelColor.blue - targetColor.blue) <= tolerance);
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
            acc.accumulate(pixel);
            this.setColor(x, y, {alpha: markValue});

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
        color: acc.attenuate(area),
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
