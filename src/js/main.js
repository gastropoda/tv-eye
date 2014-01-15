require.config({
  paths: {
    jquery: 'lib/jquery-2.0.3.min',
  }
});

require(["scratch"], function(scratch) {
  scratch.configure();
});
