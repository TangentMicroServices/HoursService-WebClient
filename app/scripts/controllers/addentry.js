'use strict';

/**
 * @ngdoc function
 * @name hoursApp.controller:AddentryCtrl
 * @description
 * # AddentryCtrl
 * Controller of the hoursApp
 */
angular.module('hoursApp')
  .controller('AddentryCtrl', function ($scope, entryService) {
    	
  		$scope.Entry = {};

    	$scope.Update = function(){
    		entryservice.Add($scope.Entry)
    			.success(function(){
    				console.log('entry added succesfully');
    			})
    			.error(function(){
    				console.log('entry failed to add');
    			})
    	};
  });
