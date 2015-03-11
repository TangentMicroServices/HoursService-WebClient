'use strict';

/**
 * @ngdoc function
 * @name hoursApp.controller:ViewentriesCtrl
 * @description
 * # ViewentriesCtrl
 * Controller of the hoursApp
 */
angular.module('hoursApp')
  .controller('ViewentriesCtrl', function ($scope, entryService) {
    	
  		$scope.Entries = [];

  		var onUsersLoaded = function(data){
  			$scope.Entries = data;
  		}

  		var onUsersLoadFailed = function(data){
  			console.log('failed to load users. ')
  		}

  		var init = function(){
  			entryservice.GetEntriesForUser()
  				.success(onUsersLoaded)
  				.error(onUsersLoadFailed);
  		};

  		init();
  });
