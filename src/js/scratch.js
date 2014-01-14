$(function() {
  function makeCanvas(id, width, height) {
    return $("<canvas/>").attr("id", id).attr("width", width).attr("height", height);
  };

  function getCanvas( element ) {
    return element.get(0).getContext("2d");
  };

  function replaceImageWithCanvas(image, canvasId) {
    var imageWidth = image.width();
    var imageHeight = image.height();

    var canvasElement = makeCanvas(canvasId, image.width(), image.height());
    var canvas = getCanvas(canvasElement);
    canvas.drawImage(image.get(0), 0, 0);
    image.replaceWith( canvasElement );
    return canvasElement;
  };

  $(window).load( function() {
    var canvasElement = replaceImageWithCanvas( $("img#input_image"), "input" );
    var canvas = getCanvas(canvasElement);

    canvasElement.click(function(e) {
      var x = e.offsetX, y = e.offsetY;
      var rgba = canvas.getImageData(x,y,1,1).data;
      console.log("x: " + x + ", y: " + y +
        "r: " + rgba[0] + ", g: " + rgba[1] + ", b: " + rgba[2]);
    });
  });
});


