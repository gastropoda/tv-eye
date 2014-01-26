define([
  "jquery", "knockout"
], function($, ko) {
  function Spectrum(options) {
    options = options || {};
    this.shades = ko.observableArray( options.shades || [] );
    this.discriminationTolerance = ko.observable( options.discriminationTolerance );
    this.calibrationTolerance = ko.observable( options.calibrationTolerance );
  }

  $.extend(Spectrum.prototype, {

    classifyColor: function( color, calibrate ) {
      var minDistance = calibrate ? this.calibrationTolerance() : this.discriminationTolerance();
      var closestShade = null;

      $.each(this.shades(), function(i, shade) {
        var distance = shade.distance(color);
        if (distance <= minDistance) {
          minDistance = distance;
          closestShade = shade;
        }
      });

      return closestShade;
    }
  });

  return Spectrum;
});

