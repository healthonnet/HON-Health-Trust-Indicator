  'use strict';

  var assert = require('assert');

  describe('Array', function() {
    describe('#indexOf()', function () {
      it('should return -1 when the value is not present', function () {
        assert.equal(-1, [1,2,3].indexOf(5));
        assert.equal(-1, [1,2,3].indexOf(0));
      });
    });
  });

  describe('Give it some context', function () {
    describe('maybe a bit more context here', function () {
      it('should run here few assertions', function () {

      });
    });
  });
