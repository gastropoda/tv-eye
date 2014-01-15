define(["flood-fill", "jquery"], function(floodFill, $) {

  describe("testing canvas", function() {

    before(function() {
      this.canvas = $("<canvas/>")
        .attr("id", "scratch")
        .width(8).height(8)
        .appendTo("#mocha");
    });

    it("gets created", function() {
      expect($("#mocha canvas#scratch").length).to.equal(1);
      expect(this.canvas.get(0)).to.be.an.instanceOf(HTMLCanvasElement);
    });

    it("is sufficiently small", function() {
      expect(this.canvas.width()).to.equal(8);
      expect(this.canvas.height()).to.equal(8);
    });


  });

});
