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
    var sortTasks = function(tasks) {
      return _.sortBy(tasks, function(task) {
        return task.project_data.title;
      });
    };

    var loadCurrentTasks = function(){
        projectService.MyTasks().then(function(response){
          var tasks = $scope.tasks = sortTasks(response);
          $scope.$emit('loadCurrentTasks', tasks);
        });
    };

    $scope.tasks = [];
    $scope.hours = [];
    // for the date picker.. need to refactor..... duplication in add and edit need to be resolved
    $scope.format = 'yyyy-MM-dd';
    $scope.minDate = new Date(2015, 1, 1);
    $scope.maxDate =  new Date();

    $scope.disabled = function() {
      return false;
    };

    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.opened = true;
    };

    var populateHours = function(){
    	for(var i=1; i<24; i++){
    		$scope.hours.push({
    			hours: i,
    			description: i + ' hours',
    		});
    		$scope.hours.push({
    			hours: i + 0.5,
    			description: i + ' hours and 30 minutes'
    		});
    	}
    };

    var init = function(){
      loadCurrentTasks();
      populateHours();
    };

    init();
  });
