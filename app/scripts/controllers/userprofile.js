'use strict';

/**
 * @ngdoc function
 * @name hoursApp.controller:UserProfileCtrl
 * @description
 * # UserProfileCtrl
 * Controller of the hoursApp
 */
angular.module('hoursApp')
  .controller('UserProfileCtrl', function ($scope, $location, $rootScope, $window, projectService) {
    $scope.currentUser = $rootScope.CurrentUser;
    $scope.accessToken = $window.localStorage.getItem('AccessToken');
    $scope.projects = [];
    $(".app, body").css("background", "#414a51");
    var init = function(){
      $scope.loaded = true;
      getProjects();

      projectService.MyTasks().then(function(response){
        $scope.tasks = response;
      });
    };

    var getProjects = function(){
      projectService.GetUserProjects($rootScope.CurrentUser.id).then(function(response){
        $scope.projects = response;
      }, function(){});
    };

    init();
});
