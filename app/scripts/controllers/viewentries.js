'use strict';

/**
 * @ngdoc function
 * @name hoursApp.controller:ViewentriesCtrl
 * @description
 * # ViewentriesCtrl
 * Controller of the hoursApp
 */
angular.module('hoursApp')
  .controller('ViewentriesCtrl', function ($scope, $location, notificationService, entryService, projectService) {
    	
  		$scope.Entries = [];
  		$scope.Projects = [];
  		$scope.Tasks = [];

  		$scope.Delete = function(entry){
  			entryService.Delete(entry.id).then(entryDeleted, entryDeletionFailed);
  		};

  		$scope.Edit = function(entry){
  			entryService.EntrySelected(entry);
  			$location.path('/editEntry');
  		};

  		var entryDeleted = function(response){
  			notificationService.success("Your entry has succesfully been deleted.");
        loadEntries();
  		};

  		var entryDeletionFailed = function(response){
  			notificationService.error("Failed to delete your entry.");
  		};

  		var onEntriesLoaded = function(data){
  			$scope.Entries = data;
  		}

  		var onEntriesLoadFailed = function(data){
        notificationService.error('failed to load entries. ');
  		}

  		var loadEntries = function(){
  			entryService.GetEntriesForUser()
  				.success(onEntriesLoaded)
  				.error(onEntriesLoadFailed);
  		}

  		var loadProjects = function(){
  			projectService.GetProjects().then(function(response){
  				$scope.Projects = response;
  			});
  		};

  		var loadTasks = function(){
  			projectService.GetTasks().then(function(response){
  				$scope.Tasks = response;
  			});
  		};

  		var init = function(){
  			loadEntries();
  			loadProjects();
  			loadTasks();
  		};

  		init();
  });
