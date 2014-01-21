define(["knockout"], function(ko) {
  return function PatchList(initialContents) {

    var self = this;
    var patches = ko.observableArray(initialContents || []);

    var PatchArrayMixin = {
      minSize: function() {
        return this.length &&
          this.map(function(patch) {
          return patch.bounds().size;
        }).reduce(paper.Size.max);
      },
      maxSize: function() {
        return this.length &&
          this.map(function(patch) {
          return patch.bounds().size;
        }).reduce(paper.Size.max);
      },
    };

    self.patches = ko.computed(function() {
      var selectedPatches = patches().filter(function(patch) {
        return patch && patch.selected();
      });

      return $.extend(selectedPatches, PatchArrayMixin);
    });

    self.get = function(i) {
      return patches()[i];
    };

    self.remove = function(patchOrIndex) {
      var i = patchOrIndex;
      if (isNaN(i)) {
        i = patches().indexOf(i);
        if (i < 0) {
          throw "No such patch";
        }
      }
      if (i < 0 || i >= patches().length) {
        throw "Patch index out of bounds";
      }
      var array = patches();
      array[i] = null;
      patches(array);
      return i;
    };

    self.nextIndex = function() {
      var hole = patches().indexOf(null);
      var tip = patches().length;
      var limit = self.maxCount();

      return hole >= 0 ? hole : (tip < limit ? tip : -1);
    };

    self.put = function(patch) {
      var i = self.nextIndex();
      if (i >= 0) {
        var array = patches();
        array[i] = patch;
        patches(array);
      }
      else {
        throw "Patch list is full";
      }
    };

    var MAX_COUNT = 254;
    self.maxCount = function() {
      return MAX_COUNT;
    };

  };
});
