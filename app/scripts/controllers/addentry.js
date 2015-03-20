'use strict';

/**
 * @ngdoc function
 * @name hoursApp.controller:AddentryCtrl
 * @description
 * # AddentryCtrl
 * Controller of the hoursApp
 */
angular.module('hoursApp')
  .controller('AddentryCtrl', function ($scope, $location, $rootScope, notificationService, entryService) {
      $scope.saveButtonText = 'Save';

      $scope.entry = {
        id: null,
        user: $rootScope.CurrentUser.id,
        project_id: 0,
        project_task_id: 0,
        status: 'Open',
        day: new Date(),
        start_time: '08:00:00',
        end_time: '17:00:00',
        hours: 8,
        overtime: 0,
        tags: ''
      };

    	$scope.Submit = function(){
        $scope.entry.day = new moment($scope.entry.day).format('YYYY-MM-DD');

    		entryService.Add($scope.entry)
    			.then(entryAdded, entryDidNotAdd);
    	};

      var entryAdded = function(){
        notificationService.success('Entry added successfully.');
        $location.path('/viewEntries');
      };

      var entryDidNotAdd = function(response){
        notificationService.error('Failed to add your entry.');
        $scope.errorMessage = response;
        $scope.errorOccured = true;
      };

      var init = function(){
        $scope.entry.day = new moment($scope.entry.day).format('YYYY-MM-DD');
      };

      init();
  });
