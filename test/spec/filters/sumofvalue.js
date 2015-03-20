'use strict';

describe('Filter: sumOfValue', function () {

  // load the filter's module
  beforeEach(module('hoursApp'));

  // initialize a new instance of the filter before each test
  var sumOfValue;
  beforeEach(inject(function ($filter) {
    sumOfValue = $filter('sum');
  }));

  var fakeData = [{
  	hours: 5
  }, {
  	hours: 5
  }];

  var fakeData = [{
  	hours: "5"
  }, {
  	hours: 5
  }];

  it('When calculating the number of hours, make sure the hours are summed.', function () {
      var result = sumOfValue(fakeData, 'hours');

      expect(result).toBe(10);
  });

  it('When calculating the number of hours, make sure the hours are summed even if string is passed.', function(){
  	  var result = sumOfValue(fakeData, 'hours');

      expect(result).toBe(10);
  });
});
