'use strict';

/**
* @ngdoc service
* @name hoursApp.projectService
* @description
* # projectService
* Service in the hoursApp.
*/
angular.module('hoursApp')
.service('projectService', function ($rootScope, jsonService, $q, $window, PROJECTSERVICE_BASE_URI, notificationService) {
    var api = {};

    var tasks = [];
    var projects = [];
    var tasksLoaded = false;

    var setTasks = function (response) {
        tasks = response;
    };

    var setProjects = function (response) {
        projects = response;
    };

    api.AreTasksLoaded= function () {
        return tasksLoaded;
    },

    api.GetTask= function (id) {
        return _.where(tasks, {id: id})[0];
    },

    api.GetProjects= function () {
        return projects;
    },

    api.MyTasks= function () {
        var deferred = $q.defer();

        //NOTE: Enable caching and fix the issue with user undefined.
        /*if(tasksLoaded){
        deferred.resolve(tasks);
        return deferred.promise;
        }*/

        //Get current user from cache
        var currentUserId = $window.localStorage.getItem('CurrentUserId');

        var promise = jsonService.Get(PROJECTSERVICE_BASE_URI, '/api/v1/tasks/?user=' + currentUserId, {})
        .success(function (response) {
            tasksLoaded = true;
            setTasks(response);
            deferred.resolve(response);
        })
        .error(function (response) {
            notificationService.error('An error occurred while trying to load my tasks.');
            deferred.reject(response);
        });

        return deferred.promise;
    },

    api.AllTasks= function () {
        var deferred = $q.defer();

        var promise = jsonService.Get(PROJECTSERVICE_BASE_URI, '/api/v1/tasks/', {})
        .success(function (response) {
            tasksLoaded = true;
            setTasks(response);
            deferred.resolve(response);
        })
        .error(function (response) {
            notificationService.error('An error occurred while trying to load all tasks.');
            deferred.reject(response);
        });

        return deferred.promise;
    }

    api.GetUserProjects= function (userID) {
        var deferred = $q.defer();

        var promise = jsonService.Get(PROJECTSERVICE_BASE_URI, '/api/v1/projects/?user=' + userID, {})
        .success(function (response) {
            setProjects(response);
            deferred.resolve(response);
        })
        .error(function (response) {
            notificationService.error('An error occurred while trying to load the users projects.');
            deferred.reject(response);
        });

        return deferred.promise;
    }

    return api;
});
