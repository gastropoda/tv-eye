define([
  "knockout"
], function(ko) {
  return persist;

  function persist(key, observable, fromJSON) {
    observable.subscribe(function(newValue) {
      localStorage[key] = ko.toJSON(newValue);
    });
    try {
      var storedValue = JSON.parse(localStorage[key]);
      if (fromJSON) {
        storedValue = fromJSON(storedValue);
      }
      observable(storedValue);
    } catch(e) {
      observable.valueHasMutated();
    }
    return observable;
  }
});
