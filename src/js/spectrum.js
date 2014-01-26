define([
  "jquery", "knockout"
], function($, ko) {
  function Spectrum(options) {
    options = options || {};
    this.shades = ko.observableArray( options.shades || [] );
  }

  $.extend(Spectrum.prototype, {

    classifyColor: function( color, tolerance) {
      var minDistance = tolerance;
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

