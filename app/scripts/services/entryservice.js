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
  .service('entryservice', function(jsonService, HOURSSERVICE_BASE_URI){

  		var entryUrl = HOURSSERVICE_BASE_URI + '/entry/'

  		return {
  			Add: function(entry){
  				return jsonService.Post(entryUrl, entry);
  			},
  			Edit: function(entry){
  				return jsonService.Put(entryUrl, entry);
  			},
  			Get: function(id){
  				return jsonService.Get(entryUrl + id, {});
  			},
  			Delete: function(id){
  				return jsonService.Delete(entryUrl + id, {})
  			},
  			GetAll: function(){
  				return jsonService.Get(entryUrl, {});
  			}
  		}
  });
