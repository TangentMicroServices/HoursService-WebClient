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
 .filter('OrderTasksByProject', function () {
 	return function (data, key) {

 		if (typeof (data) === 'undefined' && typeof (key) === 'undefined') {
 			return [];
 		}

 		var tasks = [];
 		if(typeof data !== 'undefined'){
 			for (var i = 0; i < data.length; i++) {
 				if(key === Number(data[i].project_data.pk)){
 					tasks.push(data[i]);
 				}		
 			}
 		}

 		return tasks;
 	};
 });
