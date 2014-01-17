define(["knockout"], function(ko) {
  return function ColorPatch(options) {
    var self = this;
    options = options || {};

    self.selected = ko.observable( true );
    self.area = ko.observable( options.area );
    self.color = ko.observable( options.color );
    self.bounds = ko.observable( options.bounds );

    self.toggleSelected = function() {
      return self.selected( !self.selected() );
    }
  };
});
