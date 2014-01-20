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

    var canvas = $("<canvas/>").appendTo("#scratch");
    paper.setup(canvas.get(0));

    var raster = new paper.Raster("img/groningen-test.jpg");
    var imageData;

    var uiLayer = new paper.Layer();

    raster.onLoad = function() {
      paper.view.setViewSize(this.size);
      this.setPosition( this.size.divide(2) );
      imageData = raster.getImageData();
      FloodFill.extend(imageData);
    };

    raster.onClick = function(event) {
      var point = event.point;
      var patchIndex = patchIndexAt(point);
      if (patchIndex == NO_PATCH) {
        var patch = self.findPatch(point);
        patchList.put(patch);
      } else {
        patchList.get(patchIndex).toggleSelected();
      }
    };

    function patchIndexAt(point) {
      var rgba = imageData.data;
      return rgba[ (point.x + point.y * imageData.width) * 4 + 3 ];
    }

    self.findPatch = function(point) {
      return imageData.floodFill(point, self.config.pick.tolerance, patchList.nextIndex());
    };

    var patchList = new PatchList();

    self.patches = patchList.patches;
    self.patchCount = ko.computed(function() {
      return self.patches().length;
    });

    self.patches.subscribe(function(patches){
      console.log(patches);
      uiLayer.removeChildren();
      $.each(patches, function(i, patch) {
        var patchViz = paper.Path.Rectangle({
          point: patch.bounds().point,
          size: patch.bounds().size,
          radius: 5,
          strokeColor: "white"
        });
        uiLayer.addChild(patchViz);
      });
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

    self.removePatch = function(patch) {
      var index = patchList.remove(patch);
      imageData.replaceIndex(index, NO_PATCH, patch.bounds());
    };
  };
});
