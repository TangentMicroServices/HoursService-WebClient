'use strict';

/**
 * @ngdoc directive
 * @name hoursApp.directive:entryform
 * @description
 * # entryform
 */
angular.module('hoursApp')
  .directive('entryform', function () {
    return {
      restrict: 'AE',
      templateUrl: 'views/entryform.html',
      controller: 'EntryformCtrl'
    };
  });
