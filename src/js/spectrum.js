define([
  "jquery"
], function($) {
  function Spectrum(options) {
    options = options || {};
    this.shades = options.shades;
    this.shadeTolerance = options.shadeTolerance;
  }

  $.extend(Spectrum.prototype, {

    recognizeShade: function( color ) {
      var minDistance = Infinity;
      var closestShade = null;
      var self = this;

      $.each(this.shades, function(i, shade) {
        var distance = shade.distance(color);
        if (distance <= Math.min(self.shadeTolerance, minDistance)) {
          minDistance = distance;
          closestShade = shade;
        }
      });

      return closestShade;
    }
  });

  return Spectrum;
});

