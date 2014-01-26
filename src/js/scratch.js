define([
    "knockout", "app-view-model", "jquery"
], function(ko, AppViewModel, $) {

  console.log("FIXME extract template loader");
  function loadTemplates() {
    var loadPromises = [];

    $('[data-load=template]').each(function () {
      var templateElement = $(this);
      var templateUrl = "tpl/" + templateElement.attr("id") + ".html";
      loadPromises.push(
        $.get(templateUrl)
        .done(function (data) {
          templateElement.html(data);
        })
        );
    });

    return $.when.apply($, loadPromises);
  }

  loadTemplates().done(function () {
    ko.applyBindings(new AppViewModel());
  });

});
