define([
    "jquery"
], function($) {

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

  $.extend(true,ByteColor.prototype,{
    accumulate: function( delta ) {
      this.red += delta.red;
      this.green += delta.green;
      this.blue += delta.blue;
      return this;
    },

    attenuate: function(divisor) {
      this.red = Math.floor( this.red / divisor );
      this.green = Math.floor( this.green / divisor );
      this.blue = Math.floor( this.blue / divisor );
      return this;
    },

    equals: function(other) {
      return this.red === other.red &&
             this.green === other.green &&
             this.blue === other.blue &&
             this.alpha === other.alpha;
    }
  });

  return ByteColor;
});
