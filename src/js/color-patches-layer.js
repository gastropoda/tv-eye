define(["knockout","paper"], function(ko,paper) {

  function setup(observablePatches) {
    var uiLayer = new paper.Layer();

    observablePatches.subscribe(function(patches) {
      uiLayer.removeChildren();
      $.each(patches, function(i, patch) {
        var patchViz = paper.Path.Rectangle({
          point: patch.bounds().point,
          size: patch.bounds().size,
          radius: 5,
          strokeColor: "white"
        });
        uiLayer.addChild(patchViz);
      });
      paper.view.draw();
    });
  }

  return {
    setup: setup
  };
});
