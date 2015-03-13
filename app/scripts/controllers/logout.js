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

  	var init = function(){
  		userService.Logout();
  	};

  	init();

  });
