'use strict';

/**
 * @ngdoc overview
 * @name hoursApp
 * @description
 * # hoursApp
 *
 * Main module of the application.
 */
angular
  .module('hoursApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider, $provide, $httpProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/editEntry', {
        templateUrl: 'views/editentry.html',
        controller: 'EditentryCtrl'
      })
      .when('/addEntry', {
        templateUrl: 'views/addentry.html',
        controller: 'AddentryCtrl'
      })
      .when('/viewEntries', {
        templateUrl: 'views/viewentries.html',
        controller: 'ViewentriesCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

       $provide.factory('myHttpInterceptor', function($q) {
        return {
          'request': function(config) {
            return config;
          },
         'requestError': function(rejection) {
            if (canRecover(rejection)) {
              return responseOrNewPromise
            }
            return $q.reject(rejection);
          },
          'response': function(response) {
            return response;
          },
         'responseError': function(rejection) {
            // do something on error
            if (canRecover(rejection)) {
              return responseOrNewPromise
            }
            return $q.reject(rejection);
          }
        };
      });

    $httpProvider.interceptors.push('myHttpInterceptor');
  });

angular.module('hoursApp')
  .constant('SERVICE_BASE_URI', "http://staging.userservice.tangentme.com")
  .constant('HOURSSERVICE_BASE_URI', "http://staging.hoursservice.tangentme.com");
