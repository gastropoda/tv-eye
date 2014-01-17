define(["knockout"], function(ko) {
  return function PatchList(initialContents) {

    var self = this;
    var patches = ko.observableArray(initialContents || []);

    self.patches = ko.computed(function() {
      return patches().filter(function( patch ) {
        return patch && patch.selected();
      });
    });

    self.get = function(i) {
      return patches()[i];
    };

    self.remove = function(i) {
      var array = patches();
      array[i] = null;
      patches(array);
    };

    self.nextFreeIndex = function() {
      var i = patches().indexOf(null);
      if (i >= 0) {
        return i;
      }
      else {
        i = patches().length;
        if (i <= PATCH_COUNT_MAX) {
          return i;
        }
        else {
          return -1;
        }
      }
    };

  };
});
