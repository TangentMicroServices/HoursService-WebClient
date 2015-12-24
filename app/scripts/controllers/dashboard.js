'use strict';

angular.module('hoursApp')
  .controller('DashboardCtrl', function ($scope, $filter, entryService, projectService, notificationService, $location, $rootScope) {


      $(".app, body").css("background", "#eee");

      var init = function(){
        var userId = $rootScope.CurrentUser.id;
        if(typeof userId !== 'undefined')
        {
          loadSummary(userId);
          loadProjects(userId);
          loadEntries(userId);
          loadTasks();
        }
      };

      var loadEntries = function(userId){
        entryService.GetEntries(userId)
            .success(onEntriesLoaded)
            .error(onEntriesLoadFailed);
      };

      $scope.getWeekdays = function(day){
        day = day || moment();
        var today = day.clone();
        var monday = today.clone().startOf('week');
        var days = [];
        for(var i=1; i <= 7; i++){
          var current = monday.clone().add(i, 'days');
          days.push(current.format());
        }
        return days;
      };

      $scope.days = $scope.getWeekdays();

      $scope.series = ['Hours Trend'];
      $scope.usersummary = {hours_by_day: {index: [], data: []}, get_project_breakdown: {index: [], data: []}}
      $scope.colors = ['#D0DD2B', '#98C73D', '#00A9E0', '#67CDDC', '#3B3B3D'];

      $scope.onClick = function (points, evt) {
        console.log(points, evt);
      };

      var onEntriesLoaded = function(response){
        $scope.entries = response;
        $scope.loaded = true;
      };


      var onEntriesLoadFailed = function(data){
        notificationService.error('failed to load entries.');
        $scope.loaded = true;
      };

      var loadTasks = function(){
        projectService.MyTasks().then(tasksLoaded, taskLoadFailed);
      };

      var tasksLoaded = function(response){
        $scope.tasks = response;
        $scope.task = $scope.tasks[0];
      };

      var taskLoadFailed = function(response){};

      var loadProjects = function(userId) {
        projectService.GetUserProjects(userId)
          .then(projectsLoaded, projectLoadFailed);
      }

      var projectsLoaded = function(response) {
        $scope.projects = response;
      }

      var projectLoadFailed = function(response){};

      var loadSummary = function(userId) {
        entryService.GetUserSummary(userId)
          .then(summaryLoaded, summaryLoadFailed);
      }

      var summaryLoaded = function(response) {
        angular.forEach(response.data.hours_by_day.index, function(day, index, context) {
          context[index] = moment(day).format('Do MMM');
        })
        $scope.usersummary = response.data;

      }

      var summaryLoadFailed = function(response) {}

      init();
  });
