require.config({
  paths: {
    jquery: "../../bower_components/jquery/jquery",
    paper: "../../bower_components/paper/dist/paper",
    knockout: "../../bower_components/knockout.js/knockout.debug"
  },

  map: {
    "*": {
      paper: "patch/paper"
    },
    "patch/paper": {
      paper: "paper"
    }
  }
});
