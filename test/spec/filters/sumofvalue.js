'use strict';

describe('Filter: sumOfValue', function () {

  // load the filter's module
  beforeEach(module('hoursApp'));

  // initialize a new instance of the filter before each test
  var sumOfValue;
  beforeEach(inject(function ($filter) {
    sumOfValue = $filter('sum');
  }));

  it('should return the input prefixed with "sumOfValue filter:"', function () {
   
  });

});
