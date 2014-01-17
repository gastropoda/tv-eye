define(["flood-fill", "jquery", "chai"], function(floodFill, $, chai) {

  describe("FloodFill", function() {

    var canvas, context, image, rgba;
    var canvasWidth = 7;
    var canvasHeight = 7;
    var rect = { x: 1, y: 2, w: 3, h: 4 };
    function inRect(x, y) {
      return x >= rect.x &&
        x < rect.x + rect.w &&
        y >= rect.y &&
        y < rect.y + rect.h;
    }

    beforeEach(function() {
      canvas = $("<canvas/>")
        .attr("id", "scratch")
        .width(canvasWidth).height(canvasHeight)
        .appendTo("#mocha");
      context = canvas.get(0).getContext("2d");
      context.fillStyle = "rgba(0,0,0,255)";
      context.fillRect(0, 0, canvasWidth, canvasHeight);
      context.fillStyle = "rgb(0,200,0)";
      context.fillRect(rect.x, rect.y, rect.w, rect.h);
      image = context.getImageData(0, 0, canvasWidth, canvasHeight);
      rgba = image.data;
    });

    describe(".floodFill", function() {
      var floodFillResult;

      beforeEach(function() {
        floodFill.extend(image);
        floodFillResult = image.floodFill(2, 2, 0, 1);
      });

      it("fills the color", function() {
        expect(image).to.contain.pixels(function(x, y) {
          return {
            r: 0,
            g: inRect(x, y) ? 200 : 0,
            b: 0,
            a: inRect(x, y) ? 1 : 255,
          };
        });
      });

      it("returns area", function() {
        expect(floodFillResult.area).to.eq(rect.w * rect.h);
      });

      it("returns average color", function() {
        expect(floodFillResult.averageColor).to.eql({
          r: 0,
          g: 200,
          b: 0
        });
      });

      it("returns bounds", function() {
        expect(floodFillResult.bounds).to.eql(rect);
      });
    });
  });
});
