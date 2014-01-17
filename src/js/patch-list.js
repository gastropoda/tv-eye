define(["knockout"], function(ko) {
  return function PatchList(initialContents) {

    var self = this;
    var patches = ko.observableArray(initialContents || []);

    self.patches = ko.computed(function() {
      return patches().filter(function(patch) {
        return patch && patch.selected();
      });
    });

    self.get = function(i) {
      return patches()[i];
    };

    self.remove = function(i) {
      var array = patches().slice();
      array[i] = null;
      patches(array);
    };

    self.nextIndex = function() {
      var hole = patches().indexOf(null);
      var tip = patches().length;
      var limit = self.maxCount();

      return hole >= 0 ?  hole : (tip < limit ?  tip : -1);
    };

    var MAX_COUNT = 254;
    self.maxCount = function() {
      return MAX_COUNT;
    };

  };
});
