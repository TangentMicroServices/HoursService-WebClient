'use strict';

describe('Controller: LoginCtrl', function () {

  // load the controller's module
  beforeEach(module('hoursApp'));

  var LoginCtrl,
    scope, $q;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$q_) {
    scope = $rootScope.$new();
    $q = _$q_;

    LoginCtrl = $controller('LoginCtrl', {
      $scope: scope
    });
  }));

  var fakeSuccessPromise = function(){
    var deffered = $q.defer();

    deffered.resolve();

    return deffered.promise;
  };

  var fakeAdminUser = {
    username: 'admin'
  }

  var fakeUserRetrievedPromise =  function(){
    var deffered = $q.defer();

    deffered.resolve(fakeAdminUser);

    return deffered.promise;
  }

  var fakeError = { "error_1": [ "Message 1", "Message 2"]};

  var fakeErrorPromise = function(){
    var deffered = $q.defer();

    deffered.reject(fakeError);

    return deffered.promise;
  }

  it('When user logs in, a call must be made to the log him in.', inject(function (userService) {
    spyOn(userService, 'Login').and.callFake(fakeSuccessPromise);

    scope.username = 'TestUsername';
    scope.password = 'TestPassword';

    scope.Login();

    expect(userService.Login).toHaveBeenCalledWith(scope.username, scope.password);
  }));

  it('When user loges in succesfully, make sure his details are retrieved.', inject(function(userService){
    spyOn(userService, 'Login').and.callFake(fakeSuccessPromise);
    spyOn(userService, 'GetCurrentUser').and.callFake(fakeUserRetrievedPromise);

    scope.Login();
    scope.$digest();

    expect(userService.GetCurrentUser).toHaveBeenCalled();
  }));

  it('When user logs in succesfully, make sure that a broadcast is sent to other controller that need to handle.', inject(function(userService, $rootScope, USERSERVICE_BASE_URI, $httpBackend){
    spyOn(userService, 'Login').and.callFake(fakeSuccessPromise);
    spyOn($rootScope, '$broadcast').and.callThrough();
    
    $httpBackend.whenGET(USERSERVICE_BASE_URI + "/api/v1/users/me/").respond(200, fakeAdminUser);

    scope.Login();
    $httpBackend.flush();
    scope.$digest();

    expect($rootScope.$broadcast).toHaveBeenCalledWith('UserLoggedIn', {});
  }));

  it('When user logs in succesfully, make sure that he receives a notification that he is logged in.', inject(function(notificationService, userService, $httpBackend){
    spyOn(userService, 'Login').and.callFake(fakeSuccessPromise);
    spyOn(userService, 'GetCurrentUser').and.callFake(fakeUserRetrievedPromise);
    spyOn(notificationService, 'success');

    scope.Login();
    scope.$digest();

    expect(notificationService.success).toHaveBeenCalledWith('You are currently logged in as ' + fakeAdminUser.username);
  }));

  it('When user logs in succesfully, make sure he is navigated to his entries', inject(function(userService, $location){
    spyOn(userService, 'Login').and.callFake(fakeSuccessPromise);
    spyOn(userService, 'GetCurrentUser').and.callFake(fakeUserRetrievedPromise);
    spyOn($location, 'path');

    scope.Login();
    scope.$digest();

    expect($location.path).toHaveBeenCalledWith('/viewEntries');
  }));

  it('When user login failed, make sure that the error response is set.', inject(function(userService){
    spyOn(userService, 'Login').and.callFake(fakeErrorPromise);
 
    scope.Login();
    scope.$digest();

    expect(scope.errorOccured).toBe(true);
    expect(scope.errorMessages).toEqual(fakeError);
  }));

  it('If there is problem retrieving current user details, make sure the user is notified.', inject(function(notificationService, userService){
    spyOn(userService, 'Login').and.callFake(fakeSuccessPromise);
    spyOn(userService, 'GetCurrentUser').and.callFake(fakeErrorPromise);
    spyOn(notificationService, 'error');

    scope.Login();
    scope.$digest();

    expect(notificationService.error).toHaveBeenCalledWith('Failed to retrieve your details.');
  }));

  it('If there is problem retrieving current user details, make sure the error messages are set.', inject(function(userService){
    spyOn(userService, 'Login').and.callFake(fakeSuccessPromise);
    spyOn(userService, 'GetCurrentUser').and.callFake(fakeErrorPromise);

    scope.Login();
    scope.$digest();

    expect(scope.errorOccured).toBe(true);
    expect(scope.errorMessages).toEqual(fakeError);
  }));
});
