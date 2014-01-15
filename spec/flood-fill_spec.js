define(["flood-fill", "jquery"], function(floodFill, $) {

  describe("testing canvas", function() {
    var canvas, context;
    var canvasWidth = 5, canvasHeight = 5;

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
      var rgba;

      beforeEach(function() {
        context.fillStyle = "rgba(0,0,0,255)";
        context.fillRect(0, 0, canvasWidth, canvasHeight);
        context.fillStyle = "rgb(0,200,0)";
        context.fillRect(1, 1, 3, 3);
        rgba = context.getImageData(0, 0, canvasWidth, canvasHeight).data;
      });

      it("is drawn", function() {
        var expected = [0, null, 0, 255];

        for (var y = 0; y < canvasHeight; y++) {
          for (var x = 0; x < canvasWidth; x++) {
            var inRect = x > 0 && y > 0 && x < 4 && y < 4;
            expected[1] = inRect ? 200 : 0;
            var at = " @ " + x + ", " + y;

            expect(rgba[(x + y * canvasWidth) * 4]).to.equal(expected[0], "r" + at);
            expect(rgba[(x + y * canvasWidth) * 4 + 1]).to.equal(expected[1], "g" + at);
            expect(rgba[(x + y * canvasWidth) * 4 + 2]).to.equal(expected[2], "b" + at);
            expect(rgba[(x + y * canvasWidth) * 4 + 3]).to.equal(expected[3], "a" + at);
          }
        }
      });
    });
  });
});
