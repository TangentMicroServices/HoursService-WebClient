'use strict';

/**
 * @ngdoc function
 * @name hoursApp.controller:ViewentriesCtrl
 * @description
 * # ViewentriesCtrl
 * Controller of the hoursApp
 */
angular.module('hoursApp')
    .controller('ViewentriesCtrl', function ($scope, $rootScope, $location, notificationService, entryService) {

        var onEntriesLoaded = function(data){
            $scope.entries = getSubmittedEntries(data);
            $scope.loaded = true;
        };

        var onEntriesLoadFailed = function(data){
            notificationService.error('failed to load entries.');
        };

        var taskLoadFailed = function(response){};

        var loadEntries = function(userId){
            entryService.GetEntriesForUser(userId)
                .success(onEntriesLoaded)
                .error(onEntriesLoadFailed);
        };

        var getSubmittedEntries = function(entries) {
            return entryService.GetUserSubmittedEntries();
        }

        var init = function(){
            var userId = $rootScope.CurrentUser.id;
            if(typeof userId !== 'undefined')
            {
                loadEntries(userId);
            }
        };

        $scope.entries = [];

        init();
    });
