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
        hours: 9,
        overtime: 0,
        tags: ''
      };

      $scope.task = {};

      var entryAdded = function(){
        notificationService.success('Entry added successfully.');
        $location.path('/viewOpenEntries');
      };

      var entryDidNotAdd = function(response){
        notificationService.error('Failed to add your entry.');
        $scope.errorMessage = response;
        $scope.errorOccured = true;
      };

      var init = function(){
        duplicateCopyEntryDefaults();  

        $scope.loaded = true;
        $scope.entry.day = new moment($scope.entry.day).format('YYYY-MM-DD');
      };


      var duplicateCopyEntryDefaults = function(){
        //Check if a copy flag has been set
        if(entryService.Copy()){
          var selectedEntry = entryService.GetSelectedEntry();
          console.log(selectedEntry);
          $scope.entry.comments = selectedEntry.comments;          
          $scope.entry.overtime = selectedEntry.overtime;
          $scope.entry.hours = selectedEntry.hours;
          $scope.task = {
            project : selectedEntry.project_id,
            id : selectedEntry.project_task_id
          };
        } 
      }

      var setEntryTask = function(task) {
        $scope.entry.project_id = task.project;
        $scope.entry.project_task_id = task.id;
      }

      $scope.$on('loadCurrentTasks', function(event, tasks) {
        var defaultTask = null;
        if(entryService.Copy()){

          $scope.task = _.find(tasks, function (task) {
            return task.id === $scope.task.id;
          });

          defaultTask = $scope.task;
        }else{
          var defaultTask = $scope.task = tasks[0];
        }        
        setEntryTask(defaultTask);
        //Unset the copy flag
        entryService.SetCopy(false);
      });

      $scope.Submit = function(){
        $scope.entry.day = new moment($scope.entry.day).format('YYYY-MM-DD');
        entryService.Add($scope.entry)
          .then(entryAdded, entryDidNotAdd);
      };

      $scope.Change = function () {
        var task = $scope.task;
        setEntryTask(task);
      };

      init();
  });
