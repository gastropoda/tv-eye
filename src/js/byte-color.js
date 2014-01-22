define([
    "jquery", "paper"
], function($, paper) {

  function ByteColor() {
    if (arguments.length > 2) {
      this.red = arguments[0];
      this.green = arguments[1];
      this.blue = arguments[2];
      this.alpha = arguments[3];
    }
    else if (arguments.length === 1) {
      this.red = arguments[0].red;
      this.green = arguments[0].green;
      this.blue = arguments[0].blue;
      this.alpha = arguments[0].alpha;
    }

    for (var channel in defaultColor) {
      if (typeof(this[channel]) === "undefined") {
        this[channel] = defaultColor[channel];
      }
    }
  };
  var defaultColor = {
    red: 0,
    green: 0,
    blue: 0,
    alpha: 255
  };

  $.extend(true, ByteColor.prototype, {
    accumulate: function(delta) {
      delta = new ByteColor(delta);
      return new ByteColor(
        this.red + delta.red,
        this.green + delta.green,
        this.blue + delta.blue,
        this.alpha);
    },

    attenuate: function(divisor) {
      return new ByteColor(
        Math.floor(this.red / divisor),
        Math.floor(this.green / divisor),
        Math.floor(this.blue / divisor),
        this.alpha);
    },

    equals: function(other) {
      return this.red === other.red &&
        this.green === other.green &&
        this.blue === other.blue &&
        this.alpha === other.alpha;
    },

    distance: function(other) {
      other = new ByteColor(other);
      var self = this;
      var ds = ["red","green","blue"].map(function(comp) {
        return Math.abs(self[comp] - other[comp]);
      });
      return Math.max.apply(0, ds);
    },

    within: function(tolerance, other) {
      return Math.abs(this.red - other.red) <= tolerance &&
        Math.abs(this.green - other.green) <= tolerance &&
        Math.abs(this.blue - other.blue) <= tolerance;
    },

    toPaperColor: function() {
      return new paper.Color(this.red / 255, this.green / 255, this.blue / 255, this.alpha / 255);
    },

    toString: function() {
      return this.toPaperColor().toCSS(false);
    },

    toCSS: function(hex) {
      return this.toPaperColor().toCSS(hex);
    }
  });

  return ByteColor;
});
