'use strict';

/**
 * @ngdoc function
 * @name hoursApp.controller:ViewentriesCtrl
 * @description
 * # ViewentriesCtrl
 * Controller of the hoursApp
 */
angular.module('hoursApp')
    .controller('ViewopenentriesCtrl', function ($scope, $rootScope, $location, notificationService, userService, entryService, projectService) {
        var entryDeleted = function(response){
            var userId = $scope.selectedUser.id;
            notificationService.success('Your entry has successfully been deleted.');
            loadEntries(userId);
        };

        var entryDeletionFailed = function(response){
            notificationService.error('Failed to delete your entry.');
        };

        var onEntriesLoaded = function(data){
            $scope.entries = getOpenEntries(data);
            $scope.loaded = true;
        };

        var onEntriesLoadFailed = function(data){
            notificationService.error('failed to load entries.');
        };

        var loadTasks = function(){
            projectService.MyTasks().then(tasksLoaded, taskLoadFailed);
        };

        var tasksLoaded = function(response){
            $scope.tasks = response;
        };

        var taskLoadFailed = function(response){};

        var loadEntries = function(userId){
            entryService.GetEntriesForUser(userId)
                .success(onEntriesLoaded)
                .error(onEntriesLoadFailed);
        };

        var loadUsers = function(){
            userService.GetUsers().then(usersLoaded, userLoadFailed);
        };

        var usersLoaded = function(response){
            $scope.users = response;
            $scope.selectedUser = _.findWhere($scope.users, {id: $rootScope.CurrentUser.id});
        };

        var getOpenEntries = function(entries) {
            return entryService.GetUserOpenEntries();
        }

        var userLoadFailed = function(response){};

        var init = function(){
            var userId = $rootScope.CurrentUser.id;
            if(typeof userId !== 'undefined')
            {
                loadEntries(userId);
            }

            loadTasks();
            loadUsers();
        };

        $scope.entries = [];
        $scope.tasks = [];
        $scope.users = [];
        $scope.selectedUser = null;

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

        $scope.updateUserEntries = function(){
            var userId = $scope.selectedUser.id;
            loadEntries(userId);
        };

        $scope.submitOpenEntries = function() {
            var userId = $scope.selectedUser.id;
            entryService.Submit().then(loadEntries.bind(null, userId));
        };

        init();
    });
