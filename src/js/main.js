require.config({
  paths: {
    jquery: 'lib/jquery-2.0.3.min',
    knockout: 'lib/knockout-3.0.0',
    paper: 'lib/paper-full-0.9.15',
  },
  shims: {
    "paper": {
      exports: "paper"
    }
  }
});

require(["scratch"]);
