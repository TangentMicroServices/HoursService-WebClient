'use strict';

/**
 * @ngdoc function
 * @name hoursApp.controller:AddentryCtrl
 * @description
 * # AddentryCtrl
 * Controller of the hoursApp
 */
angular.module('hoursApp')
  .controller('AddentryCtrl', function ($scope, notificationService, entryService, userService, projectService) {
    	
      $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
      $scope.format = $scope.formats[0];
      $scope.User = {};
      $scope.Entry = {};
      $scope.Tasks = [];

      $scope.disabled = function(date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
      };

      $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
      };

      $scope.minDate = new Date();

    	$scope.Submit = function(){
    		entryservice.Add($scope.Entry)
    			.success(function(response){
    				notificationService.success('Entry added succesfully.');
    			})
    			.error(function(response){
            notificationService.error('Failed to add your entry.');
    			})
    	};

      var loadCurrentUser = function(){
         userService.GetCurrentUser().then(function(response){
          $scope.User = response;
        }, function(response){
          notificationService.error(response);
        });
       };

      var loadCurrentTasks = function(){
        $scope.Tasks = projectService.GetTasks().then(function(response){
          $scope.Tasks = response;
        }, function(response){
          notificationService.error(reponse);
        });
      }

      var init = function(){
        loadCurrentUser();
        loadCurrentTasks();
      };

      init();
  });
