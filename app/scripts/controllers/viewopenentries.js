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

        //$scope.labels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
        $scope.labels = ["VOD - Guided Sales Journey Phase 1", "Vodacom Sales ToolKit Phase 2", "Tangent Internal Development", "Tangent General", "Ceramic Website SLA", "Italtile Retail Webstore", "Vodacom Smart Configurator", "Vodacom Phase 3 Release 1/2/3", "Tangent Business Development", "Vodacom GSJ Wireless"];
        $scope.data = [
            [65, 59, 80, 81, 56, 55, 40,56, 55, 40]
        ];

        $scope.options = {
            animate:{
                duration:800,
                enabled:true
            },
            barColor:'#00C4B5',
            scaleColor:false,
            lineWidth:20,
            lineCap:'circle'
        };

        var entryDeleted = function(response){
            var userId = $scope.selectedUser.id;
            notificationService.success('Your entry has successfully been deleted.');
            loadEntries(userId);
        };

        $scope.deletingItem = false;

        var entryDeletionFailed = function(response){
            notificationService.error('Failed to delete your entry.');
            $scope.deletingItem = false;
        };

        var onEntriesLoaded = function(data){
            $scope.entries = getOpenEntries(data);
            $scope.loaded = true;
            $scope.deletingItem = false;

            $scope.totalOpenHours = _.reduce($scope.entries, function(sum, el) {
                return sum + parseFloat(el.hours)
            }, 0);

            $scope.percent = ($scope.totalOpenHours / 160) * 100;
        };

        var onEntriesLoadFailed = function(data){
            notificationService.error('failed to load entries.');
            $scope.deletingItem = false;
        };

        var loadTasks = function(){
            projectService.MyTasks().then(tasksLoaded, taskLoadFailed);
        };

        var tasksLoaded = function(response){
            $scope.tasks = response;

            //$scope.labels = _.unique(_.pluck(_.pluck($scope.tasks, "project_data"),"title"));
            //debugger;
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
        $scope.selectedItem = null;

        $scope.Delete = function(){
            $scope.selectedItem.deleting = true;
            if($scope.selectedItem !== null){
                entryService.Delete($scope.selectedItem.id).then(entryDeleted, entryDeletionFailed);
            }
        };

        $scope.Edit = function(entry){
            entryService.EntrySelected(entry);
            $location.path('/editEntry');
        };

        $scope.GetTask = function(entry){
            return projectService.GetTask(entry.project_task_id);
        };

        $scope.submitOpenEntries = function() {
            var userId = $scope.selectedUser.id;
            entryService.Submit().then(loadEntries.bind(null, userId));
        };

        $scope.setSelectedEntry = function(entry) {
            $scope.selectedItem = entry;
        }

        init();
    });
