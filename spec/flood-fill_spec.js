define(["flood-fill", "jquery"], function(floodFill, $) {

  describe("testing canvas", function() {

    before(function() {
      $("<canvas/>")
        .attr("id", "scratch")
        .appendTo("#mocha");
    });

    it("gets created", function() {
      expect($("#mocha canvas#scratch").length).to.equal(1);
    });
  });

});
