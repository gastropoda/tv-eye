define(["jquery"],function($) {
  function Shade(options) {
    options = options || {};
    this.colors = options.colors || [];
    this.mergeThreshold = options.mergeThreshold || 0;
  }

  $.extend(Shade.prototype, {

    distance: function(inputColor) {
      var distances = this.colors.map(function(color) {
        return color.distance(inputColor);
      });
      return Math.min.apply(0, distances);
    }

  });

  return Shade;
});
