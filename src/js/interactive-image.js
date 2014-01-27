define([ "paper", "flood-fill" ], function(paper, FloodFill) {
  return { setup: setup };

  function setup(url, scratch) {
    paper.setup($("<canvas/>").appendTo("#scratch").get(0));
    var raster = new paper.Raster(url);
    raster.onLoad = function() {
      paper.view.setViewSize(this.size);
      this.setPosition(this.size.divide(2));
      scratch.imageData = this.getImageData();
      FloodFill.extend(scratch.imageData);
    };
    raster.onClick = function(event) {
      scratch.pickPixel(event.point);
    };
  }

});
