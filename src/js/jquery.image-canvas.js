define(["jquery"], function($) {
  $.fn.loadImage = function(url, onLoad) {
    var image = $("<img>").appendTo( this );
    image.on("load", onLoad);
    image.attr("src", url);
    return image;
  };

  $.fn.context2d = function() {
    return this.get(0).getContext("2d");
  };

  $.fn.loadImageCanvas = function(url, onLoad) {
    this.loadImage(url, function() {
      var image = $(this);
      var imageWidth = image.width();
      var imageHeight = image.height();

      var canvas= $("<canvas/>")
      .attr("width", imageWidth)
      .attr("height", imageHeight);

      canvas.context2d().drawImage(image.get(0), 0, 0);
      image.replaceWith(canvas);
      onLoad(canvas);
    }).hide();
  };
});
