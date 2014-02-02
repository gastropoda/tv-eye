define([
    /* captured by function args */
    "jquery", "knockout", "color-patch", "patch-list", "shade",
    "spectrum", "byte-color", "persist", "interactive-image", "bootstrap",
    "lazy"
    /* not captured */
], function($, ko, ColorPatch, PatchList, Shade, Spectrum,
  ByteColor, persist, InteractiveImage) {

  var Lazy = require("lazy");

  function AppViewModel() {
    this.NO_PATCH = 255;
    this.floodFillTolerance = persist("scratch.floodFillTolerance", ko.observable(30));
    this.manualTolerance = persist("scratch.manualTolerance", ko.observable(40));
    this.autoTolerance = persist("scratch.autoTolerance", ko.observable(30));
    this.gridStepWidth = persist("scratch.gridStep.width", ko.observable(50));
    this.gridStepHeight = persist("scratch.gridStep.height", ko.observable(50));
    this.minCountedPatchArea = persist("scratch.minCountedPatchArea", ko.observable(1000));
    this.countProgress = ko.observable(0);
    this.patchList = new PatchList();
    this.patches = this.patchList.patches;
    this.patchCount = ko.computed(function() { return this.patches().length; }, this);
    this.minPatchSize = ko.computed(function() { return this.patches().minSize(); }, this);
    this.maxPatchSize = ko.computed(function() { return this.patches().maxSize(); }, this);
    this.maxLogMessages = 10;
    this.messages = ko.observableArray();
    this.load( function () {
      this.spectrum = new Spectrum({ shades: [
        makeShade(60, 142, 52),
        makeShade(215, 56, 128),
        makeShade(192, 163, 33)]});
    });
    this.counts = ko.computed(AppViewModel.prototype.counts, this);

    InteractiveImage.setup("img/groningen-4.jpg",this);

    function makeShade(r,g,b) {
      return new Shade({ colors: [new ByteColor(r,g,b)], maximumSize: 3});
    }
  }

  AppViewModel.prototype.counts = function() {
    var counts = {};
    this.patches().forEach(function(patch){
      var shade = patch.shade;
      counts[shade] = (counts[shade]||0) + 1;
    });
    return this.spectrum.shades().map( function(shade) {
      return {
        count: counts[shade] || 0,
        shade: shade
      };
    });
  }

  AppViewModel.prototype.save = function() {
    localStorage["scratch.spectrum"] = ko.toJSON( this.spectrum );
  }

  AppViewModel.prototype.load = function( initialize ) {
    try {
      var json = JSON.parse( localStorage["scratch.spectrum"] );
      var shades = json.shades.map(function(shadeOpts) {
        for(var i in shadeOpts.colors) {
          shadeOpts.colors[i] = new ByteColor( shadeOpts.colors[i] );
        }
        return new Shade(shadeOpts);
      });
      this.spectrum = new Spectrum({shades: shades});
    } catch (e) {
      initialize.apply(this);
    }
  }

  AppViewModel.prototype.adjustSpectrum = function(_, event) {
    this.patches().forEach(function(patch){
      patch.shade.calibrate(patch.color());
    });
    this.save();
  }

  AppViewModel.prototype.findPatch = function(point, newIndex, neighbours) {
    return this.imageData.floodFill(point, this.floodFillTolerance(), newIndex);
  };

  AppViewModel.prototype.removePatch = function(patch) {
    var index = this.patchList.remove(patch);
    this.imageData.replaceIndex(index, this.NO_PATCH, patch.bounds());
  };

  AppViewModel.prototype.log = function(message, color) {
    color = color || "black";
    this.messages.unshift({
      message: message,
      color: color
    });
    while (this.messages().length > this.maxLogMessages) {
      this.messages.pop();
    }
  }

  AppViewModel.prototype.classifyColor = function(point, color, tolerance) {
    var shade;
    if (shade = this.spectrum.classifyColor(color, tolerance)) {
      var neighbours = [];
      var newIndex = this.patchList.nextIndex();
      var patch = this.findPatch(point, newIndex, neighbours);
      patch.shade = shade;
      $.each(neighbours, function(_,neighbourIndex) {
        var neighbour = this.patchList()[neighbourIndex];
        if (neighbour.shade == shade) {
          this.imageData.replaceIndex(neighbourIndex, newIndex, neighbour.bounds());
          this.patchList.remove(neighbour);
          patch.bounds( patch.bound().unite( neighbour.bounds() );
        }
      });
      this.patchList.put(patch);
      return patch;
    }
  }

  AppViewModel.prototype.pickPixel = function(point) {
    var pixel = this.imageData.color(point);
    var patchIndex = pixel.alpha;
    if (patchIndex == this.NO_PATCH) {
      this.classifyColor(point, pixel, this.manualTolerance());
    } else {
      this.patchList.get(patchIndex).toggleSelected();
    }
  }

  AppViewModel.prototype.autoPickPixel = function(point) {
    var pixel = this.imageData.color(point);
    var patchIndex = pixel.alpha;
    if (patchIndex === this.NO_PATCH) {
      var patch = this.classifyColor(point, pixel, this.autoTolerance());
      if (patch && !this.autoAcceptable(patch)) {
        patch.selected(false);
      }
    }
  }

  AppViewModel.prototype.autoAcceptable = function(patch) {
    return patch.area() > this.minCountedPatchArea();
  };

  function cartesianMap(xseq, yseq, project) {
    return xseq.reduce(function(product, x){
      return Lazy(product).concat(yseq.map(function(y) {
        return project(x,y);
      }));
    }, []);
  }

  AppViewModel.prototype.countPatches = function() {
    var w = 1 * this.gridStepWidth();
    var h = 1 * this.gridStepHeight();
    var wImg = this.imageData.width;
    var hImg = this.imageData.height;
    var x0 = wImg % w / 2;
    var y0 = hImg % h / 2;

    var xRange = Lazy.range(x0, wImg, w);
    var yRange = Lazy.range(y0, hImg, h);

    var nodes = cartesianMap(yRange, xRange, function(y,x) {
      return new paper.Point(x,y);
    });

    var self = this;
    var totalChecks = xRange.size() * yRange.size();
    var doneChecks = 0;
    nodes.chunk(1000).async().each(function(ps) {
      Lazy(ps).each(function(p) {
        self.autoPickPixel(p);
        doneChecks++;
      });
      self.countProgress( doneChecks / totalChecks );
    });
  }

  return AppViewModel;
});
