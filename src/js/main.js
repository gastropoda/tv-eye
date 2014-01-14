
require.config({
  paths: {
    ghoul: '../../node_modules/grunt-ghoul/lib/ghoul',
    mocha: '../../node_modules/mocha/mocha'
  }
});

define(['ghoul', 'mocha'], function(ghoul) {
  console.log(ghoul, mocha);

  mocha.setup('bdd');
  mocha.checkLeaks();
  describe('Array', function() {
    describe('#indexOf()', function() {
      it('should return -1 when the value is not present', function() {
        assert.equal(-1, [1, 2, 3].indexOf(5));
        assert.equal(-1, [1, 2, 3].indexOf(0));
      })
    })
  })
  mocha.run(function() {
    ghoul.emit('done', document.getElementById('mocha').innerHTML);
  });

});
