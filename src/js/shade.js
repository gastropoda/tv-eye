define([
  "jquery", "knockout"
],function($, ko) {
  function Shade(options) {
    options = options || {};
    this.colors = ko.observableArray( options.colors || [] );
    this.maximumSize = options.maximumSize || 5;
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
      while (this.maximumSize && this.colors().length > this.maximumSize)
        this.colors.remove( this.leastDistinctColor() );
    },

    distinctness: function(color) {
      var distinctness = 0;
      var colors = this.colors();
      for(var i in colors) {
        distinctness += colors[i].distance(color);
      }
      return distinctness;
    },

    leastDistinctColor: function() {
      var leastDistinct = null;
      var minDistinction = Infinity;
      var colors = this.colors();
      for(var i in colors) {
        var dist = this.distinctness(colors[i]);
        if (dist < minDistinction) {
          minDistinction = dist;
          leastDistinct = colors[i];
        }
      }
      return leastDistinct;
    },

    toString: function() {
      return "Shade";
    }

  });

  return Shade;
});
