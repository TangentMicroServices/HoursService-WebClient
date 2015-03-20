'use strict';

/**
 * @ngdoc function
 * @name hoursApp.controller:EditentryCtrl
 * @description
 * # EditentryCtrl
 * Controller of the hoursApp
 */
angular.module('hoursApp')
    .controller('EditentryCtrl', function ($scope, $location, projectService, entryService, notificationService) {
      $scope.entry = entryService.GetSelectedEntry();
      $scope.saveButtonText = "Save";

  		$scope.Submit = function(){
        $scope.saveButtonText = "Saving";
        $scope.entry.day = new moment($scope.entry.day).format("YYYY-MM-DD");

  			entryService.Edit($scope.entry)
  						.then(entryupdate, entryUpdateFailed);
  		};

  		var entryupdate = function(response){
        notificationService.success('Your entry has been updated.');
        $location.path('/viewEntries');
  		};

  		var entryUpdateFailed = function(response){
            //TODO check failed response and show right error message
        notificationService.error('Your entry failed to update.');
  		};

    });
