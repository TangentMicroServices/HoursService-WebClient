'use strict';

/**
 * @ngdoc function
 * @name hoursApp.controller:ViewentriesCtrl
 * @description
 * # ViewentriesCtrl
 * Controller of the hoursApp
 */
angular.module('hoursApp')
    .controller('EntriesCtrl', function ($scope, $rootScope, $location, notificationService, userService, entryService, projectService) {

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

        $scope.searchTypes = [
            {key : '', value: 'Show All'},
            {key : '1', value : 'Today'},
            {key : '2', value : 'This Week'},
            {key : '3', value : 'This Month'},
            {key : '5', value : 'Last Month'},
            {key : '4', value : 'This Year'}
        ];
        //Defaulting hours to this month
        $scope.searchCriteria = $scope.searchTypes[3];

        $scope.entries = [];
        $scope.tasks = [];
        $scope.users = [];
        $scope.selectedUser = null;
        $scope.selectedItem = null;
        $scope.task = null;

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
           $scope.entries = data;
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
            $scope.tasks.unshift({title: 'All projects - '});
            $scope.task = $scope.tasks[0];
        };

        var taskLoadFailed = function(response){};

        var loadEntries = function(userId, project_id){
            if(typeof project_id === 'undefined'){
                project_id = 3
            }
            entryService.GetEntriesByDuration(project_id, userId)
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

        $scope.Copy = function(entry){
            entryService.EntrySelected(entry);
            entryService.SetCopy(true);
            $location.path('/addEntry');
        };

        $scope.ChangeType = function(){
            entryService.GetEntriesByDuration($scope.searchCriteria.key, $rootScope.CurrentUser.id)
                .success(onEntriesLoaded)
                .error(onEntriesLoadFailed);
        };

        $scope.ChangeTask = function(){
            if($scope.task.hasOwnProperty('project_data')){
                entryService.GetEntriesByFilter($scope.task.id,'', $scope.selectedUser.id)
                .success(onEntriesLoaded)
                .error(onEntriesLoadFailed);
            }else{
                loadEntries($scope.selectedUser.id, $scope.searchCriteria.key);
            }           
        }


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
