define(["flood-fill", "jquery", "paper", "byte-color"
], function(FloodFill, $, paper, ByteColor) {

  describe("FloodFill", function() {

    var canvas, context, image;
    var resolution = new paper.Size(16, 18);
    var rect = new paper.Rectangle(2, 3, 4, 5);

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

    describe(".color()", function() {
      beforeEach(function() {
        image = context.getImageData(0, 0, resolution.width, resolution.height);
        FloodFill.extend(image);
      });

      it("returns the color given x,y", function() {
        expect(image.color(rect.x, rect.y)).to.equal(new ByteColor(0,200,0));
      });
      it("returns the color given point", function() {
        expect(image.color(rect.point)).to.equal(new ByteColor(0,200,0));
      });
      it("recovers from fractional x,y", function() {
        expect(image.color(rect.x+0.4, rect.y+0.4)).to.equal(new ByteColor(0,200,0));
      });
      it("recovers from fractional point", function() {
        var point = new paper.Point(rect.point);
        point.x += 0.4;
        point.y += 0.4;
        expect(image.color(point)).to.equal(new ByteColor(0,200,0));
      });
    });

    describe(".floodFill()", function() {
      var floodFillResult;
      var startPoint = new paper.Point(3.3,4.4);
      var tolerance = 0;
      var paintIndex = 1;

      beforeEach(function() {
        image = context.getImageData(0, 0, resolution.width, resolution.height);
        FloodFill.extend(image);
        floodFillResult = image.floodFill(startPoint, tolerance, paintIndex);
      });

      it("fills the color", function() {
        expect(image).to.contain.pixels(function(x, y) {
          return new ByteColor( 0, rect.contains(x, y) ? 200 : 0, 0, rect.contains(x, y) ? 1 : 255);
        });
      });

      it("returns patch area", function() {
        expect(floodFillResult.area()).to.eq(rect.width * rect.height);
      });

      it("returns patch color", function() {
        expect(floodFillResult.color()).to.equal(new ByteColor(0,200,0));
      });

      it("returns patch bounds", function() {
        expect(floodFillResult.bounds()).to.equal(rect);
      });
    });

    describe(".replaceIndex()", function() {
      var replaceRect = new paper.Rectangle(0, 0, rect.x + rect.width, rect.y + rect.height - 1);
      var changedRect = rect.intersect(replaceRect);

      beforeEach(function() {
        // alpha lame ass way to fill it with particular value of alpha channel
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
        var expected = new ByteColor();
        expect(image).to.contain.pixels(function(x, y) {
          expected.alpha = changedRect.contains(x, y) ? 7 : rect.contains(x, y) ? 42 : 255;
          return expected;
        });
      });
    });
  });
});
