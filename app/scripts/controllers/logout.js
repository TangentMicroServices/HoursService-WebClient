'use strict';

/**
 * @ngdoc function
 * @name hoursApp.controller:LogoutCtrl
 * @description
 * # LogoutCtrl
 * Controller of the hoursApp
 */
angular.module('hoursApp')
  .controller('LogoutCtrl', function ($scope, userService) {
    $(".app, body").css("background", "#414a51");
  	var init = function(){
      $scope.loaded = true;
  		userService.Logout();
  	};

  	init();

  });
