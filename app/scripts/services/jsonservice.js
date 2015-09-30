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
		var api = {};

		var ajax = function(apiUrl, httpMethod, url, requestData){
			return $http({
				method: httpMethod,
				url: apiUrl + url,
				data: requestData
			});
		};

		api.Get = function(apiUrl, restMethod, parameters){
			return ajax(apiUrl, 'GET', restMethod, parameters);
		};
		api.Put = function(apiUrl, restMethod, data){
			return ajax(apiUrl, 'PUT', restMethod, data);
		};
		api.Post = function(apiUrl, restMethod, data){
			return ajax(apiUrl, 'POST', restMethod, data);
		};
		api.Delete = function(apiUrl, restMethod, data){
			return ajax(apiUrl, 'DELETE', restMethod, data);
		};

		return api;
	})
