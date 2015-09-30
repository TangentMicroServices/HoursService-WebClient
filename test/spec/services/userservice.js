'use strict';

describe('Service: userService', function () {

  // load the service's module
  beforeEach(module('hoursApp'));

  // instantiate service
  var userService;

  beforeEach(inject(function (_userService_, $rootScope) {
    userService = _userService_;
  }));

  var fakeUser = {
    id: 1,
    username: "admin"
  };

  var fakeLoginRequest = {
    username: "username",
    password: "password"
  };

  var fakeLoginSuccessResponse = {
    token: 'abc'
  };

  it('When user logges in succesfully, make sure access token is set.', inject(function($httpBackend, USERSERVICE_BASE_URI, $window){
    spyOn($window.localStorage, 'setItem');

    $httpBackend.expectPOST(USERSERVICE_BASE_URI + '/api-token-auth/', fakeLoginRequest).respond(200, fakeLoginSuccessResponse);

    userService.Login(fakeLoginRequest.username, fakeLoginRequest.password);

    $httpBackend.flush();

    expect($window.localStorage.setItem).toHaveBeenCalledWith('AccessToken', fakeLoginSuccessResponse.token);
  }));

  it('When user logges in succesfully, make sure a post request is made to user service.', inject(function($httpBackend, USERSERVICE_BASE_URI){
    userService.Login(fakeLoginRequest.username, fakeLoginRequest.password);

    $httpBackend.expectPOST(USERSERVICE_BASE_URI + '/api-token-auth/', fakeLoginRequest).respond(200, fakeLoginSuccessResponse);

    $httpBackend.verifyNoOutstandingExpectation();
  }));

  it('When user logges out, make sure access token is cleared from cache.', inject(function($window){
    spyOn($window.localStorage, 'setItem');

    userService.Logout();

    expect($window.localStorage.setItem).toHaveBeenCalledWith('AccessToken', "");
  }));

  it('When user logges out, make sure that his details are also cleared from the rootScope', inject(function($rootScope){
    $rootScope.CurrentUser = { id: 1, username: "I am a cool user" };

    userService.Logout();

    expect($rootScope.CurrentUser).toEqual({});
  }));

  it('When user logges out, make sure that a broacast is sent into the browser so controllers can handle it accordingly.', inject(function($rootScope){
    spyOn($rootScope, "$broadcast");

    userService.Logout();

    expect($rootScope.$broadcast).toHaveBeenCalledWith('UserLoggedOut', {});
  }));
  //should maybe only keep cuurent user cached in userservice. instead of setting him in route scope.
  it('When fetching the current user from the access token, make sure that the current user is set in the rootScope.', inject(function($httpBackend, USERSERVICE_BASE_URI, $rootScope){
    $httpBackend.expectGET(USERSERVICE_BASE_URI + '/api/v1/users/me/').respond(200, fakeUser);

    userService.GetCurrentUser();

    $httpBackend.flush();

    expect($rootScope.CurrentUser).toEqual(fakeUser);
  }));
});
