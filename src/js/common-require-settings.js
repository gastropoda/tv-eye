require.config({
  paths: {
    jquery: "../../bower_components/jquery/jquery",
    paper: "../../bower_components/paper/dist/paper",
    knockout: "../../bower_components/knockout.js/knockout.debug",
    bootstrap: "../../bower_components/bootstrap/dist/js/bootstrap.min",
    lazy: "../../bower_components/lazy.js/lazy"
  },

  map: {
    "*": {
      paper: "patch/paper"
    },
    "patch/paper": {
      paper: "paper"
    }
  },

  shim: {
    bootstrap: {
      deps: ["jquery"]
    },
    lazy: {
      exports: "Lazy"
    }
  }
});
