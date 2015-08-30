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
            {id : 0, key : '', value: 'Show All'},
            {id : 1, key : '1', value : 'Today'},
            {id : 2, key : '2', value : 'This Week'},
            {id : 3, key : '3', value : 'This Month'},
            {id : 4, key : '5', value : 'Last Month'},
            {id : 5, key : '4', value : 'This Year'}
        ];
        //Defaulting hours to this month
        $scope.dateRange;
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
                $rootScope.dateRange = Number($scope.dateRange.id);
                if($scope.dateRange.hasOwnProperty('key')){
                    dateRange = $scope.dateRange.key;
                }
            }

            if($scope.project !== null){
                $rootScope.project = getProjectID();
                $rootScope.projectpk = $scope.project.pk;
                if($scope.project.hasOwnProperty('pk')){
                    project_id = $scope.project.pk;
                }
            }else if($rootScope.projectpk > -1){
                project_id = $rootScope.projectpk;
            }

            entryService.GetEntries(userId, dateRange, project_id)
                .success(onEntriesLoaded)
                .error(onEntriesLoadFailed);
        };

        var getProjectID = function(){
            if($scope.project !== null){
                for(var index in $scope.projects){
                    if($scope.projects[index].title === $scope.project.title){
                        return Number(index);
                    }
                }
            }
            return -1;
        };

        var loadProjects = function(){
            projectService.GetUserProjects($rootScope.CurrentUser.id).then(projectsLoaded, projectsLoadFailed);
        }

        var projectsLoaded = function(response){
            $scope.projects = response;
            $scope.projects.unshift({title: '- All projects -'});

            if(typeof $rootScope.project === 'undefined'){
                $scope.project = $scope.projects[0];
                $rootScope.project = 0;
            }else{
                $scope.project = $scope.projects[Number($rootScope.project)];
            }
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
            if(typeof $rootScope.dateRange === 'undefined'){
                $scope.dateRange = $scope.dateRangeTypes[3];
                $rootScope.dateRange = 3;
            }else{
                $scope.dateRange = $scope.dateRangeTypes[Number($rootScope.dateRange)];
            }

            loadProjects();
            loadTasks();
            loadUsers();

            if(typeof userId !== 'undefined')
            {
                loadEntries(userId);
            }
        };

        var getAllSelected = function () {
            var selectedItems = $scope.entries.filter(function (entry) {
               return entry.Selected;
            });

            return selectedItems.length === $scope.entries.length;
        }

        var setAllSelected = function (value) {
            angular.forEach($scope.entries, function (entry) {
                entry.Selected = value;
            });
        }

        $scope.submitEntry = function(entry){ };

        $scope.allSelected = function (value) {
            if (value !== undefined) {
               setAllSelected(value);
               return value;
            }

            return getAllSelected();
        }

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
            $rootScope.project = $scope.project;
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

        $scope.selectAllEntries = function(){
            $scope.submit = !$scope.submit;
            setAllSelected(true);
        }

        $scope.submitSelectedEntries = function(){
            var userId = $rootScope.CurrentUser.id;

            var entryIds = [];
            angular.forEach($scope.entries, function (entry) {
                if(entry.Selected){
                    entryIds.push(entry.id);
                }
            });
            if(entryIds.length > 0){
                entryService.Submit(entryIds.join(',')).then(loadEntries.bind(null, userId));
                $scope.submit = false;
            }else{
                notificationService.error('No entries were selected.');
            }
        };

        init();
    });
