define([
  "jquery", "knockout"
],function($, ko) {
  function Shade(options) {
    options = options || {};
    this.colors = ko.observableArray( options.colors || [] );
  }

  $.extend(Shade.prototype, {

    distance: function(inputColor) {
      var distances = this.colors().map(function(color) {
        return color.distance(inputColor);
      });
      return Math.min.apply(0, distances);
    },

    calibrate: function(color) {
      this.colors.push(color);
    }

  });

  return Shade;
});
