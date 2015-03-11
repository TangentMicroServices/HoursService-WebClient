'use strict';

/**
 * @ngdoc service
 * @name hoursApp.projectService
 * @description
 * # projectService
 * Service in the hoursApp.
 */
angular.module('hoursApp')
  .service('projectService', function (jsonService, $q, PROJECTSERVICE_BASE_URI, notificationService) {

  		var projects = [];
  		var tasks = [];
  		var projectsLoaded = false;
  		var tasksLoaded = false;

  		var setProjects = function(response){
  			projects = response;
  		}

  		var setTasks = function(response){
  			tasks = response;
  		}

  		return {
  			GetProjects: function(){
  				var deferred = $q.defer();
  				//simplyfy
  				if(projectsLoaded){
  					deferred.resolve(projects);
  					return deferred.promise;
  				}
  				//TODO remove duplication
  				var promise = jsonService.Get(PROJECTSERVICE_BASE_URI, '/projects/', {})
  					.success(function(response){
  						projectsLoaded = true;
  						setProjects(response);
  						deferred.resolve(response);
  					})
  					.error(function(response){
  						notificationService.error('An error occured while trying to load projects.');
  						deferred.reject(response);
  					});

  				return deferred.promise;
  			},
  			GetTasks: function(){
  				var deferred = $q.defer();
  				
  				if(tasksLoaded){
  					deferred.resolve(tasks);
  					return deferred.promise;
  				}

  				var promise = jsonService.Get(PROJECTSERVICE_BASE_URI, '/tasks/', {})
										.success(function(response){
					  						tasksLoaded = true;
					  						setTasks(response);
					  						deferred.resolve(response);
					  					})
					  					.error(function(response){
					  						notificationService.error('An error occured while trying to load tasks.');
					  						deferred.reject(response);
					  					});

  				return deferred.promise;
  			}
  		}

  });
