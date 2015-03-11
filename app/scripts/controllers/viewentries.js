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
  		};

  		var entryDeletionFailed = function(response){
  			notificationService.error("Failed to delete your entry.");
  		};

  		var onUsersLoaded = function(data){
  			$scope.Entries = data;
  		}

  		var onUsersLoadFailed = function(data){
  			console.log('failed to load users. ')
  		}

  		var loadEntries = function(){
  			entryService.GetEntriesForUser()
  				.success(onUsersLoaded)
  				.error(onUsersLoadFailed);
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
