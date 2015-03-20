'use strict';

/**
 * @ngdoc function
 * @name hoursApp.controller:EntryformCtrl
 * @description
 * # EntryformCtrl
 * Controller of the hoursApp
 */
angular.module('hoursApp')
  .controller('EntryformCtrl', function ($scope, projectService) {
  	
  	$scope.errorOccured = false;
    $scope.errorMessage = {};
  	$scope.tasks = [];
  	$scope.hours = [];

    var loadCurrentTasks = function(){
        projectService.MyTasks().then(function(response){
          $scope.tasks = response;
        }, function(response){ });
    };

    // for the date picker.. need to refactor..... duplication in add and edit need to be resolved
    $scope.format = 'yyyy-MM-dd';
    $scope.minDate = new Date(2015, 1, 1);
    $scope.maxDate =  new Date();

    $scope.disabled = function(date, mode) {
      return false;
    };

    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.opened = true;
    };
    // 

    var populateHours = function(){
    	for(var i=1; i<24; i++){
    		$scope.hours.push({
    			hours: i,
    			description: i + " hours",
    		});
    		$scope.hours.push({
    			hours: i + 0.5,
    			description: i + " hours and 30 minutes"
    		});
    	}
    };

    var init = function(){
      loadCurrentTasks();
      populateHours();
    };

    init();
  });
