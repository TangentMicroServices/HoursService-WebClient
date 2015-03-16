'use strict';

/**
 * @ngdoc function
 * @name hoursApp.controller:AddentryCtrl
 * @description
 * # AddentryCtrl
 * Controller of the hoursApp
 */
angular.module('hoursApp')
  .controller('AddentryCtrl', function ($scope, $location, $rootScope, notificationService, entryService, userService, projectService) {
      $scope.errorOccured = false;
      $scope.errorMessage = {};
      $scope.saveButtonText = "Save";
      $scope.tasks = [];

      $scope.entry = {
        id: null,
        user: $rootScope.CurrentUser.id,
        project_id: 0,
        project_task_id: 0,
        status: 'Open',
        day: Date.now(),
        start_time: '08:00:00',
        end_time: '17:00:00',
        hours: 8,
        overtime: 0,
        tags: ''
      };

    	$scope.Submit = function(){
        $scope.entry.day = new moment($scope.entry.day).format("YYYY-MM-DD");

    		entryService.Add($scope.entry)
    			.then(entryAdded, entryDidNotAdd);
    	};

      var entryAdded = function(response){
        notificationService.success('Entry added successfully.');
        $location.path('/viewEntries');
      };

      var entryDidNotAdd = function(response){
        notificationService.error('Failed to add your entry.');
        $scope.errorMessage = response;
        $scope.errorOccured = true;
      };

      var loadCurrentTasks = function(){
        projectService.MyTasks().then(function(response){
          $scope.tasks = response;
        }, function(response){ });
      };

       // for the date picker.. need to refactor..... duplication in add and edit need to be resolved
      $scope.format = 'yyyy-MM-dd';
      $scope.minDate = new Date(2015, 1, 1);

      $scope.disabled = function(date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
      };

      $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
      };
       // 

      var init = function(){
        loadCurrentTasks();
      };

      init();
  });
