'use strict';

/**
 * @ngdoc service
 * @name hoursApp.entryservice
 * @description
 * # entryservice
 * Service in the hoursApp.
 */

angular.module('hoursApp')
	.factory('jsonService', ['$http', '$rootScope', function($http, $rootScope){
		
		var ajax = function(apiUrl, httpMethod, url, requestData){
			return $http({
				method: httpMethod,
				url: apiUrl + url,
				data: requestData
			});
		};

		return{
			Get: function(apiUrl, restMethod, parameters){
				return ajax(apiUrl, "GET", restMethod, parameters);
			},
			Put: function(apiUrl, restMethod, data){
				return ajax(apiUrl, "PUT", restMethod, data);
			},
			Post: function(apiUrl, restMethod, data){
				return ajax(apiUrl, "POST", restMethod, data);
			},
			Delete: function(apiUrl, restMethod, data){
				return ajax(apiUrl, "DELETE", restMethod, data);
			}
		};
	}])
   .service('userService', function(jsonService, $rootScope, $q, SERVICE_BASE_URI){

   		$rootScope.CurrentUser = {};
   		$rootScope.AccessToken = '';

   		var setAccessToken = function(response){
   			if(response.token){
			     $rootScope.AccessToken = response.token;
			}
   		}

   		var setCurrentUser = function(response){
   			$rootScope.CurrentUser = response;
   		}
   		//TODO needs cleaning....
   		return {
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
   })
  .service('entryService', function(jsonService, HOURSSERVICE_BASE_URI){

  		var entryUrl = '/entry/'

  		return {
  			Add: function(entry){
  				return jsonService.Post(HOURSSERVICE_BASE_URI, entryUrl, entry);
  			},
  			Edit: function(entry){
  				return jsonService.Put(HOURSSERVICE_BASE_URI, entryUrl, entry);
  			},
  			Get: function(id){
  				return jsonService.Get(HOURSSERVICE_BASE_URI, entryUrl, {});
  			},
  			Delete: function(id){
  				return jsonService.Delete(HOURSSERVICE_BASE_URI + id, entryUrl, {})
  			},
  			GetAll: function(){
  				return jsonService.Get(HOURSSERVICE_BASE_URI, entryUrl, {});
  			},
  			GetEntriesForUser: function(user){
  				return jsonService.Get(HOURSSERVICE_BASE_URI, entryUrl, {});
  			}
  		}
  });
