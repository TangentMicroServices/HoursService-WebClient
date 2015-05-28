'use strict';

describe('Controller: ViewopenentriesCtrl', function () {

  // load the controller's module
  beforeEach(module('hoursApp'));

  var ViewentriesCtrl, scope, $q;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, _$q_, $rootScope) {
    scope = $rootScope.$new();
    $q = _$q_;
    $rootScope.CurrentUser = {
      id : 1
    }

    ViewentriesCtrl = $controller('ViewopenentriesCtrl', {
      $scope: scope
    });
  }));

  var fakeSuccessPromise = function(){
      var deferred = $q.defer();

      deferred.resolve();

      return deferred.promise;
  };

  var fakeFailedPromise = function(){
    var deferred = $q.defer();

    deferred.reject();

    return deferred.promise;
  };

  //Maybe it would be better to fetch the edtry again in the edit entry controller....
  it('When edit entry is clicked, make sure the entry is set in cache so when navigating to the edit entry page, the entry can be retrieved again.', inject(function(entryService){
    spyOn(entryService, 'EntrySelected');

    var entry = {
      id: 1
    };

    scope.Edit(entry);

    expect(entryService.EntrySelected).toHaveBeenCalledWith(entry);
  }));

  it('When edit entry is clicked. user is navigated to the edit entry page.', inject(function(entryService, $location) {
    spyOn(entryService, 'EntrySelected');
    spyOn($location,'path');

    var entry = {
      id: 2
    };

    scope.Edit(entry);

    expect($location.path).toHaveBeenCalledWith('/editEntry');
  }));

  it('When deleting an entry, make sure the entry delete entry is called.', inject(function(entryService){
    spyOn(entryService, 'Delete').and.callFake(fakeSuccessPromise);

    var entry = {
      id: 2
    };

    scope.selectedItem = entry;

    scope.Delete();

    expect(entryService.Delete).toHaveBeenCalledWith(2);
  }));

  xit('When deleting an entry, make sure that user gets a notification', inject(function($httpBackend, PROJECTSERVICE_BASE_URI, HOURSSERVICE_BASE_URI, USERSERVICE_BASE_URI, entryService, notificationService){
    spyOn(entryService, 'Delete').and.callFake(fakeSuccessPromise);
    spyOn(notificationService, 'success');

    var entry = {
      id: 2
    };

    $httpBackend.expectGET(HOURSSERVICE_BASE_URI +'/api/v1/entry/?user=1').respond(200, []);
    $httpBackend.expectGET(PROJECTSERVICE_BASE_URI +'/api/v1/tasks/?user=1').respond(200, []);
    //$httpBackend.expectGET(PROJECTSERVICE_BASE_URI +'/api/v1/tasks/').respond(200, []);
    $httpBackend.expectGET(USERSERVICE_BASE_URI +'/api/v1/users/').respond(200, []);
    //Reload entries after deleted....
    $httpBackend.expectGET(HOURSSERVICE_BASE_URI +'/api/v1/entry/?user=1').respond(200, []);

    scope.Delete(entry);
    $httpBackend.flush();
    scope.$digest();
    //
    expect(notificationService.success).toHaveBeenCalledWith('Your entry has successfully been deleted.');
  }));

  xit('When deleting and entry and the entry fails to delete, make sure user gets a notification.', inject(function($httpBackend, entryService, PROJECTSERVICE_BASE_URI, HOURSSERVICE_BASE_URI, USERSERVICE_BASE_URI, notificationService){
    spyOn(entryService, 'Delete').and.callFake(fakeFailedPromise);
    spyOn(notificationService, 'error');

    var entry = {
      id: 2
    };

    $httpBackend.expectGET(HOURSSERVICE_BASE_URI +'/api/v1/entry/?user=1').respond(200, []);
    $httpBackend.expectGET(PROJECTSERVICE_BASE_URI +'/api/v1/tasks/?user=1').respond(200, []);
      $httpBackend.expectGET(USERSERVICE_BASE_URI +'/api/v1/users/').respond(200, []);

    scope.Delete(entry);

    $httpBackend.flush();
    scope.$digest();

    expect(notificationService.error).toHaveBeenCalledWith("Failed to delete your entry.");
  }));
});
