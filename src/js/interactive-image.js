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
      var point = event.point;
      var pixel = scratch.imageData.color(point);
      var patchIndex = pixel.alpha;
      if (patchIndex == scratch.NO_PATCH) {
        if (scratch.spectrum.classifyColor(pixel, scratch.manualTolerance())) {
          var patch = scratch.findPatch(point);
          scratch.patchList.put(patch);
        } else {
          scratch.log("pixel rejected", "red");
        }
      } else {
        scratch.patchList.get(patchIndex).toggleSelected();
      }
    };
  }

});
