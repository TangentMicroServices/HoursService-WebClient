'use strict';

/**
 * @ngdoc function
 * @name hoursApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the hoursApp
 */
angular.module('hoursApp')
  .controller('LoginCtrl', function ($scope, notificationService, $location, $rootScope, userService) {
     	
  		$scope.ErrorOccured = false;
  		$scope.ErrorMessages = [];

     	$scope.username = '';
     	$scope.password = '';

     	var userLoggedIn = function(response){
			userService.GetCurrentUser().then(currentUserLoaded, currentUserLoadFailed);
     	}

     	var userLoginFailed = function(data){
     		$scope.ErrorOccured = true;
     		$scope.ErrorMessages = data.non_field_errors;
     	}

     	var currentUserLoaded = function(response){
        notificationService.success('You are currently logged in as ' + response.username);
        $location.path('/viewEntries');;
     	};

     	var currentUserLoadFailed = function(response){
        notificationService.error('Failed to retrieve you details.');
     		$scope.ErrorOccured = true;
        $scope.ErrorMessages = ['Failed to log you in. ']; 
     	};

  		$scope.Login = function(){
  			userService.Login($scope.username, $scope.password)
			  		    .then(userLoggedIn, userLoginFailed);
  		}
  });
