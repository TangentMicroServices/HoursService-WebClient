'use strict';

describe('Controller: AddentryCtrl', function () {

  beforeEach(module('hoursApp'));

  var AddentryCtrl, scope, $q;

  beforeEach(inject(function ($controller, $rootScope, _$q_) {
    scope = $rootScope.$new();

    $rootScope.CurrentUser = {
      id : 1
    }

    $q = _$q_;
    AddentryCtrl = $controller('AddentryCtrl', {
      $scope: scope
    });
  }));

  var fakeCall = function(){
      var deferred = $q.defer();

      deferred.resolve();

      return deferred.promise;
  };

  var fakeErrorFields = {
    "start_time": ["Please send a valid start_time"],
    "end_time": ["Please send a valid end_time"]
  }

  var fakeBadEntryAddCall = function(){
      var deferred = $q.defer();

      deferred.reject(fakeErrorFields);

      return deferred.promise;
  };

  // need to mock the times .. or handle timezones
  xit('Will change the day to date format supported by hoursservice.', inject(function ($q, entryService) {
  
    spyOn(entryService, 'Add').and.callFake(fakeCall);

    scope.entry = {
      id: 1,
      user: 1,
      project_id: 1,
      project_task_id: 1,
      status: 'Open',
      day: '2015-03-09T22:00:00.000Z',
      start_time: '08:00:00',
      end_time: '17:00:00',
      hours: 8,
      overtime: 0,
      tags: ''
    }

    var expectedEntry = {
      id: 1,
      user: 1,
      project_id: 1,
      project_task_id: 1,
      status: 'Open',
      day: '2015-03-10',
      start_time: '08:00:00',
      end_time: '17:00:00',
      hours: 8,
      overtime: 0,
      tags: ''
    }

    scope.Submit();

    expect(scope.entry).toEqual(expectedEntry);
    expect(entryService.Add).toHaveBeenCalledWith(expectedEntry);
  }));

  it('After adding an entry you will be navigated to the view entries page', inject(function(PROJECTSERVICE_BASE_URI, $httpBackend, entryService, $location, projectService){
    spyOn(entryService, 'Add').and.callFake(fakeCall);

    $httpBackend.expectGET(PROJECTSERVICE_BASE_URI + '/api/v1/tasks/?user=1').respond(200, []);
    spyOn($location, 'path');
    
    scope.Submit();
    $httpBackend.flush();
    scope.$digest();

    expect($location.path).toHaveBeenCalledWith('/viewEntries');
  }));

  it('When adding an antry you get a notification that the entry has been added.', inject(function(PROJECTSERVICE_BASE_URI, entryService, notificationService, $httpBackend, projectService){
    spyOn(entryService, 'Add').and.callFake(fakeCall);

    $httpBackend.expectGET(PROJECTSERVICE_BASE_URI +'/api/v1/tasks/?user=1').respond(200, []);
    spyOn(notificationService, 'success');

    scope.Submit();
    $httpBackend.flush();
    scope.$digest();

    expect(notificationService.success).toHaveBeenCalledWith('Entry added successfully.');
  }));

  it('When adding the entry fails, check that user receives an error notification', inject(function(PROJECTSERVICE_BASE_URI, $httpBackend, entryService, notificationService){
    spyOn(entryService, 'Add').and.callFake(fakeBadEntryAddCall);

    $httpBackend.expectGET(PROJECTSERVICE_BASE_URI + '/api/v1/tasks/?user=1').respond(200, []);
    spyOn(notificationService, 'error');

    scope.Submit();
    $httpBackend.flush();
    scope.$digest();

    expect(notificationService.error).toHaveBeenCalledWith('Failed to add your entry.');
  }));

  it('When adding the entry fails, check that the error message on fields gets populated.', inject(function(PROJECTSERVICE_BASE_URI, $httpBackend, entryService, notificationService){

    spyOn(entryService, 'Add').and.callFake(fakeBadEntryAddCall);

    $httpBackend.expectGET(PROJECTSERVICE_BASE_URI + '/api/v1/tasks/?user=1').respond(200, []);
    spyOn(notificationService, 'error');

    scope.Submit();
    $httpBackend.flush();
    scope.$digest();

    expect(scope.errorMessage).toEqual(fakeErrorFields);
    expect(scope.errorOccured).toBe(true);
  }));

  it('Will validate that add entries is called.', inject(function(entryService){
    spyOn(entryService, 'Add').and.callFake(fakeCall);

    scope.Submit();

    expect(entryService.Add).toHaveBeenCalled();
  }));
});
