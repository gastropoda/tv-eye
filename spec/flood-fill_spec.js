define(["flood-fill", "jquery", "chai", "paper"
], function(FloodFill, $, chai) {

  describe("FloodFill", function() {

    var canvas, context, image;
    var resolution = new paper.Size(7, 7);
    var rect = new paper.Rectangle(1, 2, 3, 4);

    beforeEach(function() {
      canvas = $("<canvas></canvas>")
        .width(resolution.width)
        .height(resolution.height)
        .appendTo("body");
      context = canvas.get(0).getContext("2d");
      context.fillStyle = "rgb(0,0,0)";
      context.fillRect(0, 0, resolution.width, resolution.height);
      context.fillStyle = "rgb(0,200,0)";
      context.fillRect(rect.x, rect.y, rect.width, rect.height);
    });

    describe(".floodFill()", function() {
      var floodFillResult;
      var startPoint = new paper.Point(2, 2);
      var tolerance = 0;
      var paintIndex = 1;

      beforeEach(function() {
        image = context.getImageData(0, 0, resolution.width, resolution.height);
        FloodFill.extend(image);
        floodFillResult = image.floodFill(startPoint, tolerance, paintIndex);
      });

      it("fills the color", function() {
        expect(image).to.contain.pixels(function(x, y) {
          return {
            r: 0,
            g: rect.contains(x, y) ? 200 : 0,
            b: 0,
            a: rect.contains(x, y) ? 1 : 255,
          };
        });
      });

      it("returns patch area", function() {
        expect(floodFillResult.area()).to.eq(rect.width * rect.height);
      });

      it("returns patch color", function() {
        expect(floodFillResult.color()).to.eql({
          r: 0,
          g: 200,
          b: 0
        });
      });

      it("returns patch bounds", function() {
        expect(floodFillResult.bounds()).to.equal(rect);
      });
    });

    describe(".replaceIndex()", function() {
      var replaceRect = new paper.Rectangle(0, 0, rect.x + rect.width, rect.y + rect.height - 1);
      var changedRect = rect.intersect(replaceRect);

      beforeEach(function() {
        // a lame ass way to fill it with particular value of alpha channel
        context.beginPath();
        context.rect(rect.x, rect.y, rect.width, rect.height);
        context.clip();
        context.globalCompositeOperation = "copy";
        // 0.165 corresponds to 8-bit 42
        context.fillStyle = "rgba(0,0,0,0.165)";
        context.fillRect(rect.x, rect.y, rect.width, rect.height);

        image = context.getImageData(0, 0, resolution.width, resolution.height);
        FloodFill.extend(image);
        image.replaceIndex(42, 7, replaceRect);
      });

      it("replaces index within the ROI", function() {
        var expected = {
          r: 0,
          g: 0,
          b: 0
        };
        expect(image).to.contain.pixels(function(x, y) {
          expected.a = changedRect.contains(x, y) ? 7 : rect.contains(x, y) ? 42 : 255;
          return expected;
        });
      });
    });
  });
});
