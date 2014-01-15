require.config({
  paths: {
    ghoul: '/node_modules/grunt-ghoul/lib/ghoul',
    mocha: '/node_modules/mocha/mocha',
    chai: '/node_modules/chai/chai'
  }
});

require(['ghoul', 'mocha', 'chai'], function(ghoul) {
  var expect = require('chai').expect
  mocha.setup('bdd');
  mocha.checkLeaks();

  describe('Array', function() {
    describe('#indexOf()', function() {
      it('should return -1 when the value is not present', function() {
        expect([1, 2, 3].indexOf(5)).to.equal(-1);
      });
    });
  });

  mocha.run(function() {
    ghoul.emit('done', document.getElementById('mocha').innerHTML);
  });

});
