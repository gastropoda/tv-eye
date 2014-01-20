define([
    /* captured by function args */
    "jquery", "knockout", "paper", "flood-fill", "color-patch", "patch-list"
    /* not captured */
], function($, ko, paper, FloodFill, ColorPatch, PatchList) {

  var NO_PATCH = 255;

  function htmlizeColor(c) {
    return "rgb(" + [c.r, c.g, c.b].join(",") + ")";
  }

  return function AppViewModel() {
    var self = this;

    self.config = {
      pick: {
        tolerance: 30
      }
    };

    var canvas = $("#scratch canvas");
    paper.setup(canvas.get(0));

    var raster = new paper.Raster("img/groningen-test.jpg");
    var imageData;

    raster.onLoad = function() {
      paper.view.setViewSize(this.size);
      this.setPosition( this.size.divide(2) );
      imageData = raster.getImageData();
      FloodFill.extend(imageData);
    };

    raster.onClick = function(event) {
      var point = event.point;
      var color = this.getPixel(point);
      var patchIndex = patchIndexFromColor(color);
      if (patchIndex == NO_PATCH) {
        var patch = self.findPatch(point);
        patchList.put(patch);
        refreshPatch(patch);
      } else {
        patchList.get(patchIndex).toggleSelected();
      }
    };

    function patchIndexFromColor(color) {
      return Math.floor(color.alpha * 255);
    }

    self.findPatch = function(point) {
      return imageData.floodFill(point, self.config.pick.tolerance, nextPatchIndex());
    };

    var patchList = new PatchList();

    self.patches = patchList.patches;
    self.patchCount = ko.computed(function() {
      return self.patches().length;
    });

    self.minPatchSize = ko.computed(function() {
      var minSize;
      self.patches().forEach(function(patch) {
        var patchSize = patch.bounds().size;
        minSize = minSize ? paper.Size.min(minSize, patchSize) : patchSize;
      });
      return minSize;
    });

    self.maxPatchSize = ko.computed(function() {
      var maxSize;
      self.patches().forEach(function(patch) {
        var patchSize = patch.bounds().size;
        maxSize = maxSize ? paper.Size.max(maxSize, patchSize) : patchSize;
      });
      return maxSize;
    });

    function nextPatchIndex() {
      return patchList.nextIndex();
    }

    self.removePatch = function(patch) {
      var index = patchList.remove(patch);
      imageData.replaceIndex(index, NO_PATCH, patch.bounds());
      refreshPatch(patch);
    };

    function refreshPatch(patch) {
      context.putImageData(
        imageData,
        0, 0,
        patch.bounds().x, patch.bounds().y,
        patch.bounds().width, patch.bounds().height);
    }


  };

});
