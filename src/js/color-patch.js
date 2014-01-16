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
  };

  return ColorPatch;
});
