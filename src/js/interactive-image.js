define([
  "paper", "flood-fill", "knockout", "mousewheel"
],
function(paper, FloodFill, ko) {
  return { setup: setup };

  function setup(url, scratch) {
    var canvas = $("<canvas/>").appendTo("#scratch");
    paper.setup(canvas.get(0));
    var raster = new paper.Raster(url);
    raster.onLoad = function() {
      var imageRatio = this.size.width / this.size.height;
      var viewSize = paper.view.viewSize;
      viewSize.height = viewSize.width / imageRatio;
      paper.view.setViewSize(viewSize);

      var imageScale = viewSize.width / this.size.width;
      this.scale(imageScale);
      this.setPosition(viewSize.divide(2));

      scratch.imageData(this.getImageData());
      FloodFill.extend(scratch.imageData());
      setupPatchesLayer(scratch.patches, imageScale);
      setupGridLayer(scratch, imageScale);
    };
    raster.onClick = function(event) {
      var relPoint = new paper.Point(
        event.point.x / event.event.target.clientWidth,
        event.point.y / event.event.target.clientHeight
      );
      var point = new paper.Point(
        Math.round(relPoint.x * raster.width),
        Math.round(relPoint.y * raster.height)
      );
      scratch.pickPixel(point);
    };

    canvas.on('mousewheel', function(event) {
      event.preventDefault();
      if (event.deltaY > 0) {
        var zoom = 3;
        paper.view.zoom = zoom;
        function center(size, zoom, c) {
          return 0.5 * size / zoom + c * (1 - 1/zoom);
        }
        var cx = center( paper.view.viewSize.width, zoom, event.offsetX);
        var cy = center( paper.view.viewSize.height, zoom, event.offsetY);
        paper.view.center = new paper.Point( cx, cy );
      } else if (event.deltaY < 0) {
        paper.view.zoom = 1;
        paper.view.center = paper.view.viewSize.divide(2);
      }
    });

  }

  function setupPatchesLayer(observablePatches, imageScale) {
    var uiLayer = new paper.Layer();

    observablePatches.subscribe(function(patches) {
      uiLayer.removeChildren();
      $.each(patches, function(i, patch) {
        var rect = patch.bounds();
        var patchViz = paper.Path.Rectangle({
          point: rect.point.multiply(imageScale),
          size: rect.size.multiply(imageScale),
          radius: 3,
          strokeColor: "rgba(255,255,255,0.8)",
          strokeWidth: 3
        });
        uiLayer.addChild(patchViz);
      });
      paper.view.draw();
    });
  }

  function setupGridLayer(scratch, scale) {
    var gridLayer = new paper.Layer();

    setupGridRefresfer( scratch.gridRangeX, function( path, x ) {
      path.moveTo( x, 0 );
      path.lineTo( x, scratch.imageData().height );
    });

    setupGridRefresfer( scratch.gridRangeY, function( path, y ) {
      path.moveTo( 0, y );
      path.lineTo( scratch.imageData().width, y );
    });

    function setupGridRefresfer(rangeObservable, lineFn) {
      var group = new paper.Group();
      gridLayer.addChild(group);
      rangeObservable.subscribe(refresher);
      refresher( rangeObservable() );

      function refresher( range ) {
        group.removeChildren();
        var path = new paper.CompoundPath({
          strokeColor: "rgba(100,255,100,0.9)",
          strokeWidth: 1
        });
        path.scale(scale);
        range.each( function(x) {
          lineFn( path, x );
        });
        group.addChild(path);
        paper.view.draw();
      }
    }
  }
});
