'use strict';

angular.module('hoursApp')
    .controller('DashboardCtrl', function ($scope, $filter, userSummaryService, notificationService, $rootScope) {

        //Chart Values
        $scope.series = ['Hours Trend'];
        $scope.usersummary = {hours_by_day: {index: [], data: []}, get_project_breakdown: {index: [], data: []}};
        $scope.colors = ['#D0DD2B', '#98C73D', '#00A9E0', '#67CDDC', '#3B3B3D'];

        var init = function(){
            var userId = $rootScope.CurrentUser.id;
            if(typeof userId !== 'undefined')
            {
                $scope.LoadUserSummary(userId);
            }
        };

        //Load User Summary
        $scope.LoadUserSummary = function(userId) {
            var result = userSummaryService.GetUserSummary(userId);

            result.then(function(response) {
                //Format the date
                angular.forEach(response.hours_by_day.index, function(day, index, context) {
                    context[index] = moment(day).format('Do MMM');
                });
                $scope.usersummary = response;
                $scope.loaded = true;
            }, function(reason) {
                notificationService.error(reason);
                $scope.loaded = true;
            });
        };

        init();
    });
