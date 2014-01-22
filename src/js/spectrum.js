define([
  "jquery", "knockout"
], function($, ko) {
  function Spectrum(options) {
    options = options || {};
    this.shades = ko.observableArray( options.shades || [] );
    this.discriminationTolerance = options.discriminationTolerance;
    this.calibrationTolerance = options.calibrationTolerance;
  }

  $.extend(Spectrum.prototype, {

    classifyColor: function( color, calibrate ) {
      var minDistance = calibrate ? this.calibrationTolerance : this.discriminationTolerance;
      var closestShade = null;

      $.each(this.shades(), function(i, shade) {
        var distance = shade.distance(color);
        if (distance <= minDistance) {
          minDistance = distance;
          closestShade = shade;
        }
      });

      if (calibrate && closestShade) {
        closestShade.calibrate( color );
      }
      return closestShade;
    }
  });

  return Spectrum;
});

