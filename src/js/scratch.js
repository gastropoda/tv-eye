define([
    "knockout", "app-view-model"
], function(ko, AppViewModel) {
  ko.applyBindings(new AppViewModel());
});
