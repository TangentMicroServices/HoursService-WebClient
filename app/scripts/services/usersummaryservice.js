'use strict';

/**
 * @ngdoc service
 * @name hoursApp.userSummaryService
 * @description
 * # projectService
 * Service in the hoursApp.
 */
angular.module('hoursApp')
    .service('userSummaryService', function ($http, $q, HOURSSERVICE_BASE_URI) {
        var api = {};

        /* Return User Summary*/
        api.GetUserSummary= function (id) {
            /*var deferred = $q.defer();
            if(id){
                $http.get(HOURSSERVICE_BASE_URI + "/api/v1/usersummary/" + id + "/")
                    .then(function (data) {
                        deferred.resolve(data);
                    }, function(response) {
                        // something went wrong
                        return $q.reject(response.data);
                    });
            }
            return deferred.promise;
            */

            return $http.get(HOURSSERVICE_BASE_URI + '/api/v1/usersummary/' + id + '/')
                .then(function(response) {
                    if (typeof response.data === 'object') {
                        return response.data;
                    } else {
                        // invalid response
                        return $q.reject(response.data);
                    }

                }, function(response) {
                    // something went wrong
                    return $q.reject(response.statusText + ' ' + response.status);
                });
        };

        return api;
    });
