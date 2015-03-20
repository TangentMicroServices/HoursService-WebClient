'use strict';

/**
 * @ngdoc service
 * @name hoursApp.jsonService
 * @description
 * # jsonService
 * Service in the hoursApp.
 */
angular.module('hoursApp')
	.factory('jsonService', function($http, $rootScope){
		
		var ajax = function(apiUrl, httpMethod, url, requestData){
			return $http({
				method: httpMethod,
				url: apiUrl + url,
				data: requestData
			});
		};

		return{
			Get: function(apiUrl, restMethod, parameters){
				return ajax(apiUrl, 'GET', restMethod, parameters);
			},
			Put: function(apiUrl, restMethod, data){
				return ajax(apiUrl, 'PUT', restMethod, data);
			},
			Post: function(apiUrl, restMethod, data){
				return ajax(apiUrl, 'POST', restMethod, data);
			},
			Delete: function(apiUrl, restMethod, data){
				return ajax(apiUrl, 'DELETE', restMethod, data);
			}
		};
	})
