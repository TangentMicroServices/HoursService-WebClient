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
     
  	$scope.loggedOut = [
  		{ url: '#login', title: 'Login' }
  	];

  	$scope.loggedIn = [
  		{ url: '#viewEntries', title: 'View Entries'},
  		{ url: '#addEntry', title: 'Add Entry' },
      { url: '#logout', title: 'Logout' }
  	]

  	$scope.navigationItems = $scope.loggedOut;

  	$scope.$on('UserLoggedIn', function(event, data){
  		$scope.navigationItems = $scope.loggedIn;
  	});

    $scope.$on('UserLoggedOut', function(event, data){
      $scope.navigationItems = $scope.loggedOut;
    });

  });
