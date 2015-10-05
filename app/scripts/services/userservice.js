'use strict';

/**
 * @ngdoc service
 * @name hoursApp.userService
 * @description
 * # userService
 * Service in the hoursApp.
 */
 angular.module('hoursApp')
 .service('userService', function(jsonService, $rootScope, $window, $q, USERSERVICE_BASE_URI){
  var api = {};
  $rootScope.CurrentUser = {};
  $rootScope.AccessToken = '';

  var setAccessToken = function(response){
    if(response.token){
      $rootScope.AccessToken = response.token;
      $window.localStorage.setItem('AccessToken', response.token);
    }
  };

  var setCurrentUser = function(response){
    $rootScope.CurrentUser = response;
    window.localStorage.setItem('CurrentUserId', response.id);
  };
   		//TODO needs cleaning....

      api.Logout = function(){

       $window.localStorage.setItem('AccessToken', '');
       $window.localStorage.setItem('CurrentUserId', '');
       setCurrentUser({});
       $rootScope.$broadcast('UserLoggedOut', {});
     };
     api.GetCurrentUser = function(){
       var deferred = $q.defer();

       jsonService.Get(USERSERVICE_BASE_URI, '/api/v1/users/me/', {})
       .success(function(response, status, headers, config){
         setCurrentUser(response);
         deferred.resolve(response, status, headers, config);
       })
       .error(function(response, status, headers, config){
         deferred.reject(response, status, headers, config);
       });

       return deferred.promise;
     };

     api.GetUsers = function(){
      var deferred = $q.defer();

      jsonService.Get(USERSERVICE_BASE_URI, '/api/v1/users/', {})
      .success(function(response, status, headers, config){
                    //setCurrentUser(response);
                    deferred.resolve(response, status, headers, config);
                  })
      .error(function(response, status, headers, config){
        deferred.reject(response, status, headers, config);
      });

      return deferred.promise;
    };

    api.Login = function(username, password){
     var deffered = $q.defer();


     var request = {
      username: username,
      password: password
    };

    jsonService.Post(USERSERVICE_BASE_URI, '/api-token-auth/', request)
    .success(function(response, status, headers, config){
      setAccessToken(response);
      deffered.resolve(response, status, headers, config);
    })
    .error(function(response, status, headers, config){
      deffered.reject(response, status, headers, config);
    });

    return deffered.promise;
  };
  return api;
});
