'use strict';

angular.module('hoursApp')
  .controller('DashboardCtrl', function ($scope, entryService, notificationService, $location, $rootScope) {

      $scope.loaded = true;

      $(".app, body").css("background", "#eee");

      var init = function(){
        var userId = $rootScope.CurrentUser.id;
        if(typeof userId !== 'undefined')
        {
          loadEntries(userId);
        }
      };
      
      var loadEntries = function(userId){
        entryService.GetEntries(userId)
            .success(onEntriesLoaded)
            .error(onEntriesLoadFailed);
      };

      var onEntriesLoaded = function(data){
        $scope.entries = data;
        $scope.loaded = true;
      };

      var onEntriesLoadFailed = function(data){
        notificationService.error('failed to load entries.');
        $scope.loaded = true;
      };


      init();
  });
