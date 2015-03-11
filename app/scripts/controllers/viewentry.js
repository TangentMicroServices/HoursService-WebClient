'use strict';

/**
 * @ngdoc function
 * @name hoursApp.controller:ViewentryCtrl
 * @description
 * # ViewentryCtrl
 * Controller of the hoursApp
 */
angular.module('hoursApp')
  .controller('ViewentryCtrl', function ($scope, entryService) {
    	
    	$scope.Entry = entryService.GetSelectedEntry();

  });
