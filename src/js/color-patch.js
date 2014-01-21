define(["knockout", "jquery"], function(ko, $) {
  function ColorPatch(options) {
    options = options || {};
    this.selected = ko.observable(true);
    this.area = ko.observable(options.area);
    this.color = ko.observable(options.color);
    this.bounds = ko.observable(options.bounds);
  };

  $.extend(true, ColorPatch.prototype, {
    toggleSelected: function() {
      return this.selected(!this.selected());
    }
  });

  return ColorPatch;
});
