'use strict';

/**
 * @ngdoc service
 * @name hoursApp.projectService
 * @description
 * # projectService
 * Service in the hoursApp.
 */
angular.module('hoursApp')
  .service('projectService', function ($rootScope, jsonService, $q, PROJECTSERVICE_BASE_URI, notificationService) {
  		var tasks = [];
  		var tasksLoaded = false;

  		var setTasks = function(response){
  			tasks = response;
  		};

  		return {
        AreTasksLoaded: function(){
          return tasksLoaded;
        },
  			GetTask: function(id){
  				return _.where(tasks, { id: id})[0];
  			},
  			MyTasks: function(){
  				var deferred = $q.defer();

          //NOTE: Enable caching and fix the issue with user undefined.
  				/*if(tasksLoaded){
  					deferred.resolve(tasks);
  					return deferred.promise;
  				}*/

  				var promise = jsonService.Get(PROJECTSERVICE_BASE_URI, '/api/v1/tasks/?user=' + $rootScope.CurrentUser.id, {})
										.success(function(response){
					  						tasksLoaded = true;
					  						setTasks(response);
					  						deferred.resolve(response);
					  					})
					  					.error(function(response){
					  						notificationService.error('An error occurred while trying to load tasks.');
					  						deferred.reject(response);
					  					});

  				return deferred.promise;
  			}
  		};
  });