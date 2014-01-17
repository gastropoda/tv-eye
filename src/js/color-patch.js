define(function() {
  var ColorPatch = function(options) {
    var self = this;
    options = options || {};

    var selected = false;
    self.selected = function(on) {
      if (arguments.length>0) {
        selected = !! on;
      }
      return selected;
    }

    var area = options.area;
    self.area = function() {
      return area;
    }

    var color = options.color;
    self.color = function() {
      return color;
    }

    var bounds = options.bounds;
    self.bounds = function() {
      return bounds;
    }
  };

  return ColorPatch;
});
