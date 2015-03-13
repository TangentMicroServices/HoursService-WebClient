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
  		$scope.errorOccured = false;
  		$scope.errorMessages = {};
     	$scope.username = '';
     	$scope.password = '';

     	var userLoggedIn = function(response){
			  userService.GetCurrentUser()
                   .then(currentUserLoaded, currentUserLoadFailed);
     	}

     	var userLoginFailed = function(response){
     		$scope.errorOccured = true;
     		$scope.errorMessages = response;
     	}

     	var currentUserLoaded = function(response){
        $rootScope.$broadcast('UserLoggedIn', {});

        notificationService.success('You are currently logged in as ' + response.username);

        $location.path('/viewEntries');
     	};

     	var currentUserLoadFailed = function(response){
        notificationService.error('Failed to retrieve your details.');
     		$scope.errorOccured = true;
        $scope.errorMessages = response; 
     	};

  		$scope.Login = function(){
  			userService.Login($scope.username, $scope.password)
			  		    .then(userLoggedIn, userLoginFailed);
  		}
  });
