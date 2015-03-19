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
        'ngTouch',
        'jlareau.pnotify',
        'ui.bootstrap'
    ])
    .config(function ($routeProvider, $provide, $httpProvider, notificationServiceProvider) {

        notificationServiceProvider.setDefaults({
            history: false,
            delay: 4000000,
            closer: false,
            closer_hover: false
        });

        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .when('/editEntry', {
                templateUrl: 'views/addentry.html',
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
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl'
            })
            .when('/viewentry', {
                templateUrl: 'views/viewentry.html',
                controller: 'ViewentryCtrl'
            })
            .when('/topnavigation', {
                templateUrl: 'views/topnavigation.html',
                controller: 'TopnavigationCtrl'
            })
            .when('/logout', {
                templateUrl: 'views/logout.html',
                controller: 'LogoutCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });

        $provide.factory('myHttpInterceptor', function($q, $rootScope, $window) {
            return {
                'request': function(config) {
                    var accessToken = $window.localStorage.getItem('AccessToken');

                    if(accessToken && accessToken !== '' && accessToken !== null){
                        config.headers.Authorization = 'Token ' + accessToken
                    }
                    return config;
                },
                'requestError': function(rejection) {
                    return $q.reject(rejection);
                },
                'response': function(response) {
                    return response;
                },
                'responseError': function(rejection) {
                    return $q.reject(rejection);
                }
            };
        });

        $httpProvider.interceptors.push('myHttpInterceptor');
    })
    .run(function ($location, $window, $rootScope, userService, notificationService) {
        var accessToken = $window.localStorage.getItem('AccessToken');

        if(accessToken && accessToken != '' && accessToken != null){
            userService.GetCurrentUser().then(function(){
                notificationService.success('Logging you in...');
                $location.path('/viewEntries');
                $rootScope.$broadcast('UserLoggedIn', {});
            }, function(){
                notificationService.error('Could not retrieve your details. Please login again.');
                window.localStorage.setItem("AccessToken", "");
                $location.path('/login');
            });
        }
    });

