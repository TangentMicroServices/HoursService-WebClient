'use strict';

/**
 * @ngdoc filter
 * @name hoursApp.filter:sumOfValue
 * @function
 * @description
 * # sumOfValue
 * Filter in the hoursApp.
 */
angular.module('hoursApp')
  .filter('sum', function () {
    return function (data, key) {
		if (typeof (data) === 'undefined' && typeof (key) === 'undefined') {
			return 0;
		}
		var sum = 0;

		for (var i = 0; i < data.length; i++) {
			sum = sum + parseFloat(data[i][key]);		
		}
		return sum;
	};
  });
