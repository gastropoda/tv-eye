$(function() {
  function makeCanvas(id, width, height) {
    return $("<canvas/>").attr("id", id).attr("width", width).attr("height", height);
  };

  function replaceImageWithCanvas(image, canvasId) {
    var imageWidth = image.width();
    var imageHeight = image.height();

    var canvasElement = makeCanvas("input", image.width(), image.height());
    var canvas = canvasElement.get(0).getContext("2d");
    canvas.drawImage(image.get(0), 0, 0);
    image.replaceWith( canvasElement );
    return canvas;
  }

  $(window).load( function() {
    var canvas = replaceImageWithCanvas( $("img#input_image") );
  });
});


