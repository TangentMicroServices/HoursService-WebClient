'use strict';

/**
 * @ngdoc function
 * @name hoursApp.controller:ViewentriesCtrl
 * @description
 * # ViewentriesCtrl
 * Controller of the hoursApp
 */
angular.module('hoursApp')
  .controller('ViewentriesCtrl', function ($scope, $rootScope, $location, notificationService, entryService, projectService) {
    	
  		$scope.entries = [];
      $scope.tasks = [];
  		
  		$scope.Delete = function(entry){
  			entryService.Delete(entry.id).then(entryDeleted, entryDeletionFailed);
  		};

  		$scope.Edit = function(entry){
  			entryService.EntrySelected(entry);
  			$location.path('/editEntry');
  		};

      $scope.GetTask = function(entry){
         return projectService.GetTask(entry.project_task_id);
      };

  		var entryDeleted = function(response){
  			notificationService.success("Your entry has succesfully been deleted.");
        loadEntries();
  		};

  		var entryDeletionFailed = function(response){
  			notificationService.error("Failed to delete your entry.");
  		};

  		var onEntriesLoaded = function(data){
  			$scope.entries = data;
  		};

  		var onEntriesLoadFailed = function(data){
        notificationService.error('failed to load entries. ');
  		};

      var loadTasks = function(){
        projectService.MyTasks().then(tasksLoaded, taskLoadFailed);
      };

      var tasksLoaded = function(response){
        $scope.tasks = response;
      };

      var taskLoadFailed = function(response){};

  		var loadEntries = function(){
  			entryService.GetEntriesForUser($rootScope.CurrentUser.id)
  				.success(onEntriesLoaded)
  				.error(onEntriesLoadFailed);
  		}

  		var init = function(){
  			loadEntries();
        loadTasks();
  		};

  		init();
  });
