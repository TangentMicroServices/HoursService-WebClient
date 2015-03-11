'use strict';

/**
 * @ngdoc function
 * @name hoursApp.controller:EditentryCtrl
 * @description
 * # EditentryCtrl
 * Controller of the hoursApp
 */
angular.module('hoursApp')
  .controller('EditentryCtrl', function ($scope, entryService) {
    	
  		$scope.Entry = entryService.GetSelectedEntry();

  		$scope.Update = function(){
  			entryService.Edit($scope.Entry)
  						.then(entryupdate, entryUpdateFailed);
  		};

  		var entryupdate = function(response){

  		};

  		var entryUpdateFailed = function(response){

  		};
  });
