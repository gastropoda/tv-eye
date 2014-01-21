define([
  "jquery"
], function($) {
  function Spectrum(options) {
    options = options || {};
    this.shades = options.shades;
    this.discriminationTolerance = options.discriminationTolerance;
  }

  $.extend(Spectrum.prototype, {

    classifyColor: function( color, adopt ) {
      var minDistance = this.discriminationTolerance;
      var closestShade = null;

      $.each(this.shades, function(i, shade) {
        var distance = shade.distance(color);
        if (distance <= minDistance) {
          minDistance = distance;
          closestShade = shade;
        }
      });

      if (adopt && closestShade) {
        closestShade.adopt( color );
      }
      return closestShade;
    }
  });

  return Spectrum;
});

