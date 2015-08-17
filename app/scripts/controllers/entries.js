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

        $scope.dateRangeTypes = [
            {key : '', value: 'Show All'},
            {key : '1', value : 'Today'},
            {key : '2', value : 'This Week'},
            {key : '3', value : 'This Month'},
            {key : '5', value : 'Last Month'},
            {key : '4', value : 'This Year'}
        ];
        //Defaulting hours to this month
        $scope.dateRange = $scope.dateRangeTypes[3];
        $scope.submit = false;

        $scope.entriesForSubmission = [];

        $scope.entries = [];
        $scope.tasks = [];
        $scope.projects = [];
        $scope.users = [];
        $scope.selectedUser = null;
        $scope.selectedItem = null;
        $scope.task = null;
        $scope.project = null;
        $scope.deletingItem = false;

        var entryDeleted = function(response){
            var userId = $scope.selectedUser.id;
            notificationService.success('Your entry has successfully been deleted.');
            loadEntries(userId);
        };

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

        var loadEntries = function(userId){
            var dateRange = '';
            var project_id = '';

            if($scope.dateRange !== null){
                if($scope.dateRange.hasOwnProperty('key')){
                    dateRange = $scope.dateRange.key;
                }
            }

            if($scope.project !== null){
                if($scope.project.hasOwnProperty('pk')){
                    project_id = $scope.project.pk;
                }
            }

            entryService.GetEntries(userId, dateRange, project_id)
                .success(onEntriesLoaded)
                .error(onEntriesLoadFailed);
        };

        var loadProjects = function(){
            projectService.GetUserProjects($rootScope.CurrentUser.id).then(projectsLoaded, projectsLoadFailed);
        }

        var projectsLoaded = function(response){
            $scope.projects = response;
            $scope.projects.unshift({title: '- All projects -'});
            $scope.project = $scope.projects[0];
        };

        var projectsLoadFailed = function(response){};

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

            loadProjects();
            loadTasks();
            loadUsers();
        };

        $scope.submitEntry = function(entry){

        };

        $scope.entriesForSubmission = function(){
            return $scope.entriesForSubmission.length > 0;
        };

        $scope.clearSubmissionEntries = function(){
            for(var i = $scope.entriesForSubmission.length - 1; i >= 0; i--) {
                $scope.entriesForSubmission.splice(i, 1);
            }
            $scope.submit = false;
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

        $scope.Change = function(){
            loadEntries($rootScope.CurrentUser.id);
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

        $scope.submitEntries = function(){
            $scope.submit = !$scope.submit;
        }

        init();
    });
