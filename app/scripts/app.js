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
            delay: 40,
            closer: true,
            closer_hover: true
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
                controller: 'ViewentriesCtrl',
                requireLogin: true
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
            .when('/overview', {
                templateUrl: 'views/entriesoverview.html',
                controller: 'EntriesOverviewCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });

        $provide.factory('myHttpInterceptor', function($q, $rootScope, $window, $location) {
            return {
                'request': function(config) {
                    var accessToken = $window.localStorage.getItem('AccessToken');

                    if(accessToken && accessToken !== '' && accessToken !== null){
                        config.headers.Authorization = 'Token ' + accessToken;
                    }
                    return config;
                },
                'requestError': function(rejection) {
                    return $q.reject(rejection);
                },
                'response': function(response) {

                    var accessToken = $window.localStorage.getItem('AccessToken');

                    var hasAccessToken = accessToken !== '' && accessToken !== null;

                    if(!hasAccessToken){
                        $location.path('/login');
                    }

                    return response;
                },
                'responseError': function(rejection) {
                    return $q.reject(rejection);
                }
            };
        });

        $httpProvider.interceptors.push('myHttpInterceptor');
    })
    /*.run(function($location, $window, $rootScope, userService, notificationService){

        $rootScope.$on("$locationChangeStart", function(event, next, current) {
            var accessToken = $window.localStorage.getItem('AccessToken');
            var currentUserId = $window.localStorage.getItem('CurrentUserId');

            var hasAccessToken = accessToken !== '' && accessToken !== null;
            var hasCurrentUser = currentUserId !== '' && currentUserId !== null;

            if(hasAccessToken && !hasCurrentUser){
                userService.GetCurrentUser().then(function(){
                    notificationService.success('Logging you in...');
                    $location.path('/viewEntries');
                    $rootScope.$broadcast('UserLoggedIn', {});
                }, function(){
                    notificationService.error('Could not retrieve your details. Please login again.');
                    window.localStorage.setItem('AccessToken', '');
                    window.localStorage.setItem('CurrentUserId', '');
                    $location.path('/login');
                });
            }else if (hasAccessToken && hasCurrentUser){
                notificationService.success('Logging you in...');
                $location.path('/viewEntries');
                $rootScope.$broadcast('UserLoggedIn', {});
            }
            else{
                notificationService.error('Could not retrieve your details. Please login again.');
                window.localStorage.setItem('AccessToken', '');
                window.localStorage.setItem('CurrentUserId', '');
                $location.path('/login');
            }
        });*/

    .run(function ($location, $window, $rootScope, $timeout, userService, notificationService) {
        var accessToken = $window.localStorage.getItem('AccessToken');
        var currentUserId = $rootScope.CurrentUser.id = $window.localStorage.getItem('CurrentUserId');

        var hasAccessToken = accessToken !== '' && accessToken !== null;
        var hasCurrentUser = currentUserId !== '' && currentUserId !== null;

        if(hasAccessToken && !hasCurrentUser){
            userService.GetCurrentUser().then(function(){
                notificationService.success('Logging you in...');
                $location.path('/viewEntries');
                $rootScope.$broadcast('UserLoggedIn', {});
            }, function(){
                notificationService.error('Could not retrieve your details. Please login again.');
                window.localStorage.setItem('AccessToken', '');
                window.localStorage.setItem('CurrentUserId', '');
                $location.path('/login');
            });
        }else if (hasAccessToken && hasCurrentUser){
            notificationService.success('Logging you in...');
            $location.path('/viewEntries');
            userService.GetCurrentUser().then(function() {
                $rootScope.$broadcast('UserLoggedIn', {});
            });
        }
        else{
            notificationService.error('Could not retrieve your details. Please login again.');
            window.localStorage.setItem('AccessToken', '');
            window.localStorage.setItem('CurrentUserId', '');
            $location.path('/login');
        }
    });

