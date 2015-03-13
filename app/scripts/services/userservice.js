'use strict';

/**
 * @ngdoc service
 * @name hoursApp.userService
 * @description
 * # userService
 * Service in the hoursApp.
 */
angular.module('hoursApp')
  .service('userService', function(jsonService, $rootScope, $window, $q, SERVICE_BASE_URI){

   		$rootScope.CurrentUser = {};
   		$rootScope.AccessToken = '';

   		var setAccessToken = function(response){
   			if(response.token){
			     $rootScope.AccessToken = response.token;
              $window.localStorage.setItem('AccessToken', response.token);
   		   }
         }  

   		var setCurrentUser = function(response){
   			$rootScope.CurrentUser = response;
   		}
   		//TODO needs cleaning....
   		return {
            Logout: function(){
               $window.localStorage.setItem('AccessToken', "");
               setCurrentUser({});
               $rootScope.$broadcast('UserLoggedOut', {});
            },
   			GetCurrentUser: function(){
   				var deferred = $q.defer();

   				var promise = jsonService.Get(SERVICE_BASE_URI, '/users/me/', {})
   					.success(function(response, status, headers, config){
   						setCurrentUser(response);
   						deferred.resolve(response, status, headers, config);
   					})
   					.error(function(response, status, headers, config){
   						deferred.reject(response, status, headers, config);
   					});

   				return deferred.promise;
   			},
   			Login: function(username, password){
   				var deffered = $q.defer();

   				var request = {
   					username: username,
   					password: password
   				};

   				var promise = jsonService.Post(SERVICE_BASE_URI, '/api-token-auth/', request)
   										  .success(function(response, status, headers, config){
   										  	setAccessToken(response);
   										  	deffered.resolve(response, status, headers, config);
   										  })
   										  .error(function(response, status, headers, config){
   										  	deffered.reject(response, status, headers, config);
   										  });
   				return deffered.promise;
   			}
   		}
   });