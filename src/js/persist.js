define([
  "knockout"
], function(ko) {
  return persist;

  function persist(key, observable) {
    observable.subscribe(function(newValue) {
      localStorage[key] = ko.toJSON(newValue);
    });
    try {
      var storedValue = JSON.parse(localStorage[key]);
      observable(storedValue);
    } catch(e) {
      observable.valueHasMutated();
    }
    return observable;
  }
});
