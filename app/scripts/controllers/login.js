'use strict';

/**
 * @ngdoc function
 * @name hoursApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the hoursApp
 */
angular.module('hoursApp')
  .controller('LoginCtrl', function ($scope, $location, $rootScope, userService) {
     	
  		$scope.ErrorOccured = false;
  		$scope.ErrorMessages = [];

     	$scope.username = '';
     	$scope.password = '';

     	var userLoggedIn = function(response){
     		console.log('logged in');
			$location.path('/home');
     	}

     	var userLoginFailed = function(data){
     		$scope.ErrorOccured = true;
     		$scope.ErrorMessages = data.non_field_errors;
     	}

  		$scope.Login = function(){
  			userService.Login($scope.username, $scope.password)
			  		    .then(userLoggedIn, userLoginFailed);
  		}
  });
