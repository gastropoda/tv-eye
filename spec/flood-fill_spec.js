define(["flood-fill", "jquery", "chai"], function(floodFill, $, chai) {

  describe("testing canvas", function() {
    var canvas, context;
    var canvasWidth = 5,
      canvasHeight = 5;

    beforeEach(function() {
      canvas = $("<canvas/>")
        .attr("id", "scratch")
        .width(canvasWidth).height(canvasHeight)
        .appendTo("#mocha");
      context = canvas.get(0).getContext("2d");
    });

    it("gets created", function() {
      expect($("#mocha canvas#scratch").length).to.equal(1);
      expect(canvas.get(0)).to.be.an.instanceOf(HTMLCanvasElement);
    });

    it("is sufficiently small", function() {
      expect(canvas.width()).to.equal(canvasWidth);
      expect(canvas.height()).to.equal(canvasHeight);
    });

    describe("context", function() {
      it("gets setup", function() {
        expect(context).to.be.an.instanceOf(CanvasRenderingContext2D);
      });
    });

    describe("green 3x3 square", function() {
      var image, rgba;

      beforeEach(function() {
        context.fillStyle = "rgba(0,0,0,255)";
        context.fillRect(0, 0, canvasWidth, canvasHeight);
        context.fillStyle = "rgb(0,200,0)";
        context.fillRect(1, 1, 3, 3);
        image = context.getImageData(0, 0, canvasWidth, canvasHeight);
        rgba = image.data;
      });

      it("is drawn", function() {
        expect(image).to.contain.pixels(function(x, y) {
          var inRect = x > 0 && y > 0 && x < 4 && y < 4;
          return {
            r: 0,
            g: inRect ? 200 : 0,
            b: 0,
            a: 255,
          };
        });
      });

      describe("floodFill", function() {
        beforeEach(function() {
          floodFill.extend(image);
          image.floodFill(2, 2, 0, 1);
        });

        it("fills the color", function() {
          expect(image).to.contain.pixels(function(x, y) {
            var inRect = x > 0 && y > 0 && x < 4 && y < 4;
            return {
              r: 0,
              g: inRect ? 200 : 0,
              b: 0,
              a: inRect ? 1 : 255,
            };
          });
        });

      });
    });
  });
});
