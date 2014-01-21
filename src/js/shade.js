define(["jquery"],function($) {
  function Error(message) {
    this.message = message;
    this.name = "Shade Error";
  }

  function Shade() {
    this._colors = Array.prototype.slice.call(arguments);
  }

  $.extend(Shade.prototype, {
    colors: function() {
      return this._colors.slice();
    },
    distance: function(inputColor) {
      var distances = this.colors().map(function(color) {
        return color.distance(inputColor);
      });
      return Math.min.apply(0, distances);
    }
  });

  return Shade;
});
