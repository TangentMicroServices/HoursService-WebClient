'use strict';

/**
 * @ngdoc function
 * @name hoursApp.controller:TopnavigationCtrl
 * @description
 * # TopnavigationCtrl
 * Controller of the hoursApp
 */
angular.module('hoursApp')
    .controller('TopnavigationCtrl', function ($scope) {
        $scope.leftLoggedOut = [];
        $scope.rightLoggedOut = [
            { url: '#login', title: 'Login' }
        ];

        $scope.leftLoggedIn = [
            { url: '#viewEntries', title: 'View Entries'},
            { url: '#addEntry', title: 'Add Entry' }
        ];

        $scope.rightLoggedIn = [
            { url: '#logout', title: 'Logout' }
        ];

        $scope.leftNavigationItems = $scope.leftLoggedOut;
        $scope.rightNavigationItems = $scope.rightLoggedOut;

        $scope.$on('UserLoggedIn', function(event, data){
            $scope.leftNavigationItems = $scope.leftLoggedIn;
            $scope.rightNavigationItems = $scope.rightLoggedIn;
        });

        $scope.$on('UserLoggedOut', function(event, data){
            $scope.leftNavigationItems = $scope.leftLoggedOut;
            $scope.rightNavigationItems = $scope.rightLoggedOut;
        });
    });
