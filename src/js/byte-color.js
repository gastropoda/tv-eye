define([
], function() {
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
  var defaultColor = { red: 0, green: 0, blue: 0, alpha: 255 };

  return ByteColor;
});
