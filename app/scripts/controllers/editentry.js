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
      var entryupdate = function() {
        notificationService.success('Your entry has been updated.');
        $location.path('/myhours');
      };

      var entryUpdateFailed = function(response){
        //TODO check failed response and show right error message
        notificationService.error('Your entry failed to update.');
        $scope.errorMessage = response;
        $scope.errorOccured = true;
      };

      $scope.entry = entryService.GetSelectedEntry();
      $scope.saveButtonText = 'Save';
      $scope.errorMessage = {};
      $scope.errorOccured = false;

      $scope.loaded = true;

      $scope.task = {
        project: $scope.entry.project_id,
        id: $scope.entry.project_task_id
      };

      $scope.$on('loadCurrentTasks', function(event, tasks) {
        $scope.task = _.find(tasks, function (task) {
          return task.id === $scope.task.id;
        });
      });

  		$scope.Submit = function(){
        $scope.saveButtonText = 'Saving';
        $scope.entry.day = new moment($scope.entry.day).format("YYYY-MM-DD");

  			entryService.Edit($scope.entry)
  						.then(entryupdate, entryUpdateFailed);
  		};

      $scope.Change = function () {
        var task = $scope.task;
        $scope.entry.project_id = task.project;
        $scope.entry.project_task_id = task.id;
      };
    });
