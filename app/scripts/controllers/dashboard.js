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

      $scope.barData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        series: [
            {
              data: [5, 4, 3, 7, 5, 10, 3],
              name: "Project Three",
              className: 'chart-red-bg'
            },
            {
              data: [8, 10, 4, 8, 10, 6, 8],
              name: "Data",
              className: 'chart-green-bg'
            },
            {
                data: [18, 3, 9, 12, 10, 16, 18],
                name: "Data",
                className: "chart-grey-bg"
            }
        ]
    };

    $scope.chartOpts = {
      low: 0,
      height: 280,
      showLine: true,
      showPoint: true,
      fullWidth: true,
      high: 24,
      axisX: {
        showLabel: true,
        showGrid: false
      },
      axisY: {
        showLabel: true,
        showGrid: false
      }
    }

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
