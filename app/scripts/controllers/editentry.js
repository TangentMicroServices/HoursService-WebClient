'use strict';

/**
 * @ngdoc function
 * @name hoursApp.controller:EditentryCtrl
 * @description
 * # EditentryCtrl
 * Controller of the hoursApp
 */
angular.module('hoursApp')
    .controller('EditentryCtrl', function ($scope, $location, projectService, entryService, notificationService) {
      $scope.errorOccured = false;
      $scope.errorMessage = {};
      $scope.entry = entryService.GetSelectedEntry();
      $scope.tasks = [];
      $scope.saveButtonText = "Save";

  		$scope.Submit = function(){
        $scope.saveButtonText = "Saving";
        $scope.entry.day = new moment($scope.entry.day).format("YYYY-MM-DD");

  			entryService.Edit($scope.entry)
  						.then(entryupdate, entryUpdateFailed);
  		};

  		var entryupdate = function(response){
        notificationService.success('Your entry has been updated.');
        $location.path('/viewEntries');
  		};

  		var entryUpdateFailed = function(response){
            //TODO check failed response and show right error message
        notificationService.error('Your entry failed to update.');
        $scope.errorMessage = response;
        $scope.errorOccured = true;
  		};

      var loadCurrentTasks = function(){
        $scope.tasks = projectService.MyTasks().then(function(response){
          $scope.tasks = response;
        },
        function(response){
          notificationService.error(reponse);
        });
      };

      //for the date picker.. need to refactor..... duplication in add and edit need to be resolved
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

      var init = function(){
        loadCurrentTasks();
      };

      init();
    });
